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

export interface ImageGenerationProvider {
  providerId: string;
  name: string;
  generateScenePrompt(
    scene: AdaptedScene,
    originalScene?: Scene
  ): Promise<SceneVisualPromptPackage>;
  generateCharacterPrompt(
    character: Character,
    scene: AdaptedScene
  ): Promise<CharacterVisualPromptPackage>;
  generateAll(
    adaptedScreenplay: AdaptedScreenplay,
    originalScreenplay: Screenplay
  ): Promise<VisualPackages>;
}
