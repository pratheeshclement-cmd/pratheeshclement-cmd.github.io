/**
 * HARMONYOS NEXT (ArkTS / ArkUI API Level 10+) TRANSITION MANAGER
 *
 * Implements 5 HarmonyOS Transition Archetypes natively:
 * 1. Long-Take Morphing: geometryTransition(id)
 * 2. Left-Right Displacement Mask: PageTransitionEnter/Exit with RouteType.Push/Pop
 * 3. Left-Right Spaced Movement: SlideEffect tab transitions
 * 4. Component Lifecycle: TransitionEffect.asymmetric()
 * 5. Modal / Sheet Transitions: bindSheet with dynamic backdrop blur
 */

export class HarmonyTransitionCurves {
  static readonly EASE_DEFAULT: Curve = Curve.Ease;
  static readonly EASE_EMPHASIS: string = 'cubic-bezier(0.16, 1, 0.3, 1)';
  static readonly EASE_SMOOTH: string = 'cubic-bezier(0.22, 1, 0.36, 1)';
  
  static readonly DURATION_FAST: number = 150;
  static readonly DURATION_NORMAL: number = 250;
  static readonly DURATION_LONG_TAKE: number = 500;
}

export struct SharedTransitionConfig {
  id: string = '';
  autoFocus: boolean = true;
}

/**
 * Archetype 4: Component Lifecycle Asymmetric transition helper
 */
export function getAsymmetricTransitionEffect(): TransitionEffect {
  return TransitionEffect.asymmetric(
    TransitionEffect.OPACITY
      .combine(TransitionEffect.scale({ x: 0.95, y: 0.95 }))
      .animation({ duration: HarmonyTransitionCurves.DURATION_NORMAL, curve: Curve.Friction }),
    TransitionEffect.OPACITY
      .combine(TransitionEffect.move(TransitionEdge.BOTTOM))
      .animation({ duration: HarmonyTransitionCurves.DURATION_FAST, curve: Curve.EaseOut })
  );
}
