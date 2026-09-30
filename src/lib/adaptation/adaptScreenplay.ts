import {
  AdaptationDecision,
  AdaptationPlan,
  AdaptationSuggestion,
  AdaptedDialogue,
  AdaptedScene,
  AdaptedScreenplay,
  Screenplay,
} from "@/types/domain";

export function adaptScreenplay(
  screenplay: Screenplay,
  plan: AdaptationPlan,
  decisions: Record<string, AdaptationDecision>
): AdaptedScreenplay {
  // Build lookup of approved/edited suggestions ONLY
  const activeSuggestionsMap = new Map<string, { suggestion: AdaptationSuggestion; effectiveText: string; effectiveDevanagari: string }>();

  for (const suggestion of plan.suggestions) {
    const decision = decisions[suggestion.id];
    const status = decision ? decision.status : suggestion.status;

    if (status === "approved" || status === "edited") {
      const effectiveText = (status === "edited" && decision?.editedValue)
        ? decision.editedValue
        : (suggestion.userEditedText || suggestion.proposed);

      const effectiveDevanagari = (status === "edited" && decision?.editedValue)
        ? decision.editedValue
        : (suggestion.devanagariProposed || suggestion.proposed);

      activeSuggestionsMap.set(suggestion.id, {
        suggestion,
        effectiveText,
        effectiveDevanagari,
      });
    }
  }

  let totalApproved = 0;
  const adaptedScenes: AdaptedScene[] = [];

  for (const scene of screenplay.scenes) {
    const appliedInScene: string[] = [];

    // 1. Scene Heading Adaptation
    let adaptedHeading = scene.heading;
    const headingSuggestion = Array.from(activeSuggestionsMap.values()).find(
      (s) => s.suggestion.sceneId === scene.id && s.suggestion.category === "Environment" && scene.heading.includes("ANCESTRAL HOMESTEAD")
    );
    if (headingSuggestion) {
      adaptedHeading = headingSuggestion.effectiveDevanagari;
      appliedInScene.push(headingSuggestion.suggestion.id);
      totalApproved++;
    }

    // 2. Action Lines Adaptation
    const adaptedActions: string[] = [];
    for (const act of scene.actions) {
      let actText = act.text;

      // Check prop/costume/setting suggestions
      for (const { suggestion, effectiveText } of activeSuggestionsMap.values()) {
        if (suggestion.sceneId === scene.id && actText.includes(suggestion.original)) {
          actText = actText.split(suggestion.original).join(effectiveText);
          if (!appliedInScene.includes(suggestion.id)) {
            appliedInScene.push(suggestion.id);
            totalApproved++;
          }
        }
      }
      adaptedActions.push(actText);
    }

    // 3. Dialogue Adaptation
    const adaptedDialogues: AdaptedDialogue[] = [];
    for (const dia of scene.dialogue) {
      let adaptedText = dia.text;
      let devanagariText = dia.text;
      const appliedForThisDia: string[] = [];

      for (const { suggestion, effectiveText, effectiveDevanagari } of activeSuggestionsMap.values()) {
        if (suggestion.sceneId === scene.id) {
          // Check if suggestion applies to this dialogue
          if (dia.text.includes(suggestion.original)) {
            adaptedText = adaptedText.split(suggestion.original).join(effectiveText);
            devanagariText = devanagariText.split(suggestion.original).join(effectiveDevanagari);
            appliedForThisDia.push(suggestion.id);
            if (!appliedInScene.includes(suggestion.id)) {
              appliedInScene.push(suggestion.id);
              totalApproved++;
            }
          }
        }
      }

      // If full dialogue replacement suggestion was matched, use its direct Devanagari text
      const fullMatch = Array.from(activeSuggestionsMap.values()).find(
        (s) => s.suggestion.sceneId === scene.id && s.suggestion.original.trim().toLowerCase() === dia.text.trim().toLowerCase()
      );
      if (fullMatch) {
        adaptedText = fullMatch.effectiveText;
        devanagariText = fullMatch.effectiveDevanagari;
        if (!appliedForThisDia.includes(fullMatch.suggestion.id)) {
          appliedForThisDia.push(fullMatch.suggestion.id);
        }
      }

      adaptedDialogues.push({
        dialogueId: dia.id,
        characterId: dia.characterId,
        characterName: dia.characterName,
        parenthetical: dia.parenthetical,
        originalText: dia.text,
        adaptedText,
        devanagariText,
        appliedSuggestionIds: appliedForThisDia,
      });
    }

    adaptedScenes.push({
      sceneId: scene.id,
      sceneNumber: scene.sceneNumber,
      originalHeading: scene.heading,
      adaptedHeading,
      locationName: scene.locationName,
      timeOfDay: scene.timeOfDay,
      characterIds: [...scene.characterIds],
      actions: adaptedActions,
      dialogues: adaptedDialogues,
      appliedAdaptations: appliedInScene,
    });
  }

  return {
    screenplayId: `ADP-SCR-${Date.now()}`,
    scenes: adaptedScenes,
    generatedAt: new Date().toISOString(),
    provider: "DemoAdaptationProvider (Deterministic Marwari Engine)",
    totalScenes: adaptedScenes.length,
    totalApprovedAdaptations: totalApproved || activeSuggestionsMap.size,
    summary: `Transformed ${screenplay.scenes.length} scene(s) into Marwari (Rural Jodhpur, Devanagari) applying ${totalApproved || activeSuggestionsMap.size} approved cultural adjustments across dialogue and action blocks.`,
  };
}
