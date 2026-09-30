import {
  AdaptedScene,
  AdaptedScreenplay,
  Character,
  CharacterVisualPromptPackage,
  Scene,
  SceneVisualPromptPackage,
  Screenplay,
  VisualPackages,
} from "@/types/domain";
import { ImageGenerationProvider } from "./types";

export class DemoImageGenerationProvider implements ImageGenerationProvider {
  public providerId = "demo-visual-prompts-jodhpur-v1";
  public name = "Deterministic Marwari Visual Prompt Engine (Rural Jodhpur)";

  public async generateScenePrompt(
    scene: AdaptedScene,
    originalScene?: Scene
  ): Promise<SceneVisualPromptPackage> {
    const isAncestralScene = scene.originalHeading.includes("ANCESTRAL HOMESTEAD") || scene.originalHeading.includes("HOMESTEAD");
    const lightingTime = originalScene?.timeOfDay || scene.timeOfDay;

    return {
      visualId: `VIS-${scene.sceneId}`,
      sceneId: scene.sceneId,
      subject: isAncestralScene
        ? "Dramatic confrontation between rural patriarch Bhawani Singh and returning son Vikram by an ancestral stepwell"
        : `Dramatic scene ${scene.sceneNumber} in rural Marwar: ${scene.locationName} (${lightingTime})`,
      environment:
        "Rural Thar desert fringe near Jodhpur, cracked arid clay soil, distant thorny Khejri (Prosopis cineraria) and Rohida trees",
      architecture:
        "Weathered golden-yellow and pink sandstone haveli verandah (पोल), intricate stone jaali, dry subterranean baori (stepwell)",
      costume:
        "Bhawani in handspun off-white Angarkha and saffron safa; Vikram in dusty denim workshirt and motorcycle boots",
      props:
        "Ornate brass lota resting on parapet stone, dust-caked Royal Enfield with red sacred thread (moli) on handlebars",
      lighting: `${lightingTime} atmospheric light ('गोधूलि वेला'), low-angled copper sun rays casting elongated dramatic shadows, airborne sand shimmer`,
      mood:
        "High stoic tension, filial friction, sacred solemnity of drought and heritage",
      camera: "Cinematic wide angle, 35mm anamorphic, eye-level with the stepwell parapet",
      framing:
        "Two-shot with well parapet bisecting the frame, patriarch grounded on ancestral stone, son off-center near modern motorcycle",
      culturalConstraints: [
        "Authentic Jodhpur sandstone texture, not generic European brick",
        "Saffron safa tied in traditional Marwari Rajput phenta style",
        "Khejri tree silhouette (Prosopis cineraria) native to Thar desert",
      ],
      continuityConstraints: [
        "Bhawani's saffron safa must remain identical across all dusk scenes",
        "The brass lota remains on the parapet stone once placed",
        "Vikram's motorcycle remains parked on the outer sand perimeter",
      ],
      finalPrompt:
        "Cinematic film still, 35mm anamorphic. EXT. THAR DESERT STEPWELL - DUSK. In a rural Rajasthani hamlet near Jodhpur, an elderly patriarch (70s, sharp features, crisp off-white Angarkha, saffron safa turban) stands firm on a yellow sandstone stepwell parapet. Across from him, his estranged son (40s, dusty western denim, world-weary) leans against a vintage motorcycle. Low golden hour dusk sun, dust particles gleaming in warm amber light, ancient dry stone baori, deep cultural gravitas, photorealistic cinematic lighting, Arri Alexa Mini LF, 8k resolution.",
    };
  }

  public async generateCharacterPrompt(
    character: Character,
    scene: AdaptedScene
  ): Promise<CharacterVisualPromptPackage> {
    const isVikram = character.name.includes("VIKRAM");
    const sceneContext = scene.locationName || "Thar desert hamlet";

    if (isVikram) {
      return {
        visualId: `VIS-${character.id}`,
        characterId: character.id,
        characterName: character.name,
        appearance:
          "Early 40s, sun-weathered urban fatigue, 3-day stubble, conflicted eyes, lean muscular posture, furrowed brow",
        costume:
          "Dust-stained faded denim shirt, rugged leather work boots, worn leather belt, silver amulet tucked inside collar",
        ageDescriptor: "40s",
        environment: `${sceneContext} perimeter, dry stepwell background, vintage motorcycle silhouette`,
        continuityRequirements: [
          "Dust streak pattern on blue denim shirt must be consistent across scenes",
          "Silver amulet chain visible at neck opening",
        ],
        finalPrompt:
          "Character concept portrait. VIKRAM (40s). Faded dust-caked blue denim shirt, rugged stance, conflicted tired expression, city weariness colliding with ancestral heritage. Desert golden hour backlighting, photorealistic portrait photography, medium close-up, cinematic color grading.",
      };
    }

    return {
      visualId: `VIS-${character.id}`,
      characterId: character.id,
      characterName: character.name,
      appearance:
        "Early 70s, patrician bone structure, sharp piercing hawk gaze, silver moustache, erect proud posture, sun-hardened skin",
      costume:
        "Handspun textured off-white Angarkha, crisp saffron-dyed Marwari safa (phenta), silver ear studs (murki)",
      ageDescriptor: "70s",
      environment: "Sandstone haveli veranda and stepwell altar, warm desert breeze",
      continuityRequirements: [
        "Safa fold and pleat angle must remain consistent in all scenes",
        "Silver murki visible in both ears",
        "Brass lota held with both hands or placed on parapet",
      ],
      finalPrompt:
        "Character concept portrait. THAKUR BHAWANI SINGH (70s). Patriarch of the Thar desert. Piercing dignified gaze, neatly groomed silver moustache, wearing a handspun khadi Angarkha and a vibrant saffron Marwari safa. Weathered yellow sandstone haveli background, warm evening glow, dignified authority, high emotional depth, cinematic master portrait.",
    };
  }

  public async generateAll(
    adaptedScreenplay: AdaptedScreenplay,
    originalScreenplay: Screenplay
  ): Promise<VisualPackages> {
    const scenePackages: SceneVisualPromptPackage[] = [];
    for (const scene of adaptedScreenplay.scenes) {
      const orig = originalScreenplay.scenes.find((s) => s.id === scene.sceneId);
      const pkg = await this.generateScenePrompt(scene, orig);
      scenePackages.push(pkg);
    }

    const characterPackages: CharacterVisualPromptPackage[] = [];
    for (const char of originalScreenplay.characters) {
      const firstScene = adaptedScreenplay.scenes[0];
      if (firstScene) {
        const pkg = await this.generateCharacterPrompt(char, firstScene);
        characterPackages.push(pkg);
      }
    }

    return {
      scenePackages,
      characterPackages,
      generatedAt: new Date().toISOString(),
      provider: "DemoImageGenerationProvider (Deterministic Visual Framing Engine)",
    };
  }
}
