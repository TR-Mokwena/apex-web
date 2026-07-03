// The product-tour composition: 5 scenes stitched with cross transitions.
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import "./style.css";
import { poppins, mono, C } from "./lib/brand";
import { IntroScene } from "./scenes/Intro";
import { DashboardScene } from "./scenes/Dashboard";
import { BoardScene } from "./scenes/Board";
import { InsightsScene } from "./scenes/Insights";
import { OutroScene } from "./scenes/Outro";

export const FPS = 30;
// Cross-transition lengths (frames): fades breathe a touch, slides stay snappy.
const FADE = 20;
const SLIDE = 16;

// Per-scene durations (frames), proportioned to how much each scene has to read:
// dashboard (densest) > insights > board; intro/outro are short brand beats.
export const SCENES = { intro: 100, dashboard: 238, board: 210, insights: 224, outro: 140 };
// Total runtime = Σ scenes − overlap of the 4 transitions (2 fades + 2 slides).
export const DURATION = Object.values(SCENES).reduce((a, b) => a + b, 0) - (FADE * 2 + SLIDE * 2);

const fadeT = () => ({ presentation: fade(), timing: linearTiming({ durationInFrames: FADE }) });
const slideT = () => ({ presentation: slide({ direction: "from-right" }), timing: linearTiming({ durationInFrames: SLIDE }) });

export const ApexTour = () => (
  <AbsoluteFill style={{ "--font-poppins": poppins, "--font-plex-mono": mono, fontFamily: poppins, background: C.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENES.intro}>
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fadeT()} />

      <TransitionSeries.Sequence durationInFrames={SCENES.dashboard}>
        <DashboardScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...slideT()} />

      <TransitionSeries.Sequence durationInFrames={SCENES.board}>
        <BoardScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...slideT()} />

      <TransitionSeries.Sequence durationInFrames={SCENES.insights}>
        <InsightsScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fadeT()} />

      <TransitionSeries.Sequence durationInFrames={SCENES.outro}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
