// Lists every composition Remotion Studio / the renderer can see.
import { Composition } from "remotion";
import { ApexTour, DURATION, FPS } from "./ApexTour";

export const RemotionRoot = () => (
  <Composition
    id="ApexTour"
    component={ApexTour}
    durationInFrames={DURATION}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
