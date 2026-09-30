import "server-only";

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
import { getGeminiClient, getGeminiImageModel } from "../gemini/client";
import { DemoImageGenerationProvider } from "./DemoImageGenerationProvider";

export interface ImageGenerationOptions {
  generateImagesImmediately?: boolean;
}

export class GeminiImageGenerationProvider {
  public providerId = "gemini-visual-studio-v1";
  public name = "Gemini Visual Production Engine (gemini-3.1-flash-image)";

  private deterministicEngine = new DemoImageGenerationProvider();

  /**
   * Generates a single image from a structured prompt using Gemini image generation model.
   * Returns a base64 Data URL (e.g. "data:image/jpeg;base64,...").
   */
  public async generateImageForPrompt(prompt: string): Promise<string> {
    const ai = getGeminiClient();
    const model = getGeminiImageModel();

    // Strategy 1: Call ai.models.generateImages (Standard Imagen/Gemini Image API)
    try {
      const response = await ai.models.generateImages({
        model,
        prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: "image/jpeg",
          aspectRatio: "16:9",
        },
      });

      const firstImage = response.generatedImages?.[0];
      if (firstImage?.image?.imageBytes) {
        return `data:image/jpeg;base64,${firstImage.image.imageBytes}`;
      }
    } catch (err1: unknown) {
      console.warn(
        `generateImages call with model '${model}' failed, attempting generateContent modality fallback:`,
        err1 instanceof Error ? err1.message : err1
      );

      // Strategy 2: Call ai.models.generateContent with responseModalities (Multimodal preview models)
      try {
        const response2 = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseModalities: ["IMAGE", "TEXT"],
          },
        });

        // Search for inlineData in parts
        const candidates = response2.candidates || [];
        for (const candidate of candidates) {
          const parts = candidate.content?.parts || [];
          for (const part of parts) {
            if (part.inlineData?.data) {
              const mime = part.inlineData.mimeType || "image/jpeg";
              return `data:${mime};base64,${part.inlineData.data}`;
            }
          }
        }
      } catch (err2: unknown) {
        const msg = err2 instanceof Error ? err2.message : String(err2);
        throw new Error(`Gemini image generation failed for model '${model}': ${msg}`);
      }

      throw new Error(`Gemini image model '${model}' returned empty image payload.`);
    }

    throw new Error(`No image payload returned from model '${model}'.`);
  }

  /**
   * Constructs scene prompt package and optionally calls Gemini image generator.
   */
  public async generateSceneVisual(
    scene: AdaptedScene,
    originalScene?: Scene,
    generateImage: boolean = false
  ): Promise<SceneVisualPromptPackage> {
    // Generate canonical structured prompt
    const basePkg = await this.deterministicEngine.generateScenePrompt(scene, originalScene);

    // Enrich prompt with approved adaptation context
    const enrichedPrompt = `Cinematic film still, 35mm anamorphic. ${scene.adaptedHeading}. Rural Thar desert fringe near Jodhpur, Rajasthan. ${basePkg.subject}. Architecture: ${basePkg.architecture}. Costume: ${basePkg.costume}. Lighting: ${basePkg.lighting}. Mood: ${basePkg.mood}. Photorealistic cinematic lighting, authentic Rajasthani heritage, golden sandstone, 8k resolution, Arri Alexa LF.`;

    const pkg: SceneVisualPromptPackage = {
      ...basePkg,
      finalPrompt: enrichedPrompt,
    };

    if (generateImage) {
      try {
        const imageUrl = await this.generateImageForPrompt(enrichedPrompt);
        pkg.imageUrl = imageUrl;
        pkg.imageGeneratedAt = new Date().toISOString();
      } catch (err: unknown) {
        pkg.imageError = err instanceof Error ? err.message : String(err);
      }
    }

    return pkg;
  }

  /**
   * Constructs character prompt package and optionally calls Gemini image generator.
   */
  public async generateCharacterVisual(
    character: Character,
    scene: AdaptedScene,
    generateImage: boolean = false
  ): Promise<CharacterVisualPromptPackage> {
    const basePkg = await this.deterministicEngine.generateCharacterPrompt(character, scene);

    const enrichedPrompt = `Character concept portrait photograph. ${character.name}, ${basePkg.ageDescriptor}. ${basePkg.appearance}. Costume: ${basePkg.costume}. Environment: Rural Jodhpur sandstone backdrop, ${basePkg.environment}. Atmospheric desert lighting, dignified authentic portrayal, 35mm portrait lens, photorealistic master portrait.`;

    const pkg: CharacterVisualPromptPackage = {
      ...basePkg,
      finalPrompt: enrichedPrompt,
    };

    if (generateImage) {
      try {
        const imageUrl = await this.generateImageForPrompt(enrichedPrompt);
        pkg.imageUrl = imageUrl;
        pkg.imageGeneratedAt = new Date().toISOString();
      } catch (err: unknown) {
        pkg.imageError = err instanceof Error ? err.message : String(err);
      }
    }

    return pkg;
  }

  /**
   * Generates all visual packages for scenes and characters.
   */
  public async generateAll(
    adaptedScreenplay: AdaptedScreenplay,
    originalScreenplay: Screenplay,
    options?: ImageGenerationOptions
  ): Promise<VisualPackages> {
    const generateImmediately = options?.generateImagesImmediately ?? false;

    const scenePackages: SceneVisualPromptPackage[] = [];
    for (const scene of adaptedScreenplay.scenes) {
      const orig = originalScreenplay.scenes.find((s) => s.id === scene.sceneId);
      const pkg = await this.generateSceneVisual(scene, orig, generateImmediately);
      scenePackages.push(pkg);
    }

    const characterPackages: CharacterVisualPromptPackage[] = [];
    for (const char of originalScreenplay.characters) {
      const firstScene = adaptedScreenplay.scenes[0];
      if (firstScene) {
        const pkg = await this.generateCharacterVisual(char, firstScene, generateImmediately);
        characterPackages.push(pkg);
      }
    }

    return {
      scenePackages,
      characterPackages,
      generatedAt: new Date().toISOString(),
      provider: `${this.name} (${getGeminiImageModel()})`,
      isLiveAiGenerated: true,
    };
  }
}
