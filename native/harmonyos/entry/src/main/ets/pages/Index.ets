/**
 * HARMONYOS NEXT Index Main Entry Page (ArkTS / ArkUI API Level 10+)
 * Combines all 5 HarmonyOS Transition Archetypes:
 * 1. Long-Take Morphing (geometryTransition)
 * 2. Left-Right Displacement Mask (PageTransitionEnter/Exit RouteType.Push/Pop)
 * 3. Left-Right Spaced Movement (SlideEffect Tab Switch)
 * 4. Component Lifecycle (TransitionEffect.asymmetric)
 * 5. Modal / Sheet Transitions (bindSheet)
 */

import { ProjectCard } from '../components/ProjectCard';
import { BottomSheetContent } from '../components/BottomSheet';

@Entry
@Component
struct Index {
  @State isSheetOpen: boolean = false;
  @State activeTab: number = 0;
  @Provide('pageInfos') pageInfos: NavPathStack = new NavPathStack();

  @Builder
  PageMap(name: string) {
    if (name === 'ProjectDetail') {
      NavDestination() {
        // Shared element target
      }
    }
  }

  // Archetype 2: Page route transitions with depth mask
  pageTransition() {
    PageTransitionEnter({ duration: 500, curve: Curve.Ease })
      .slide(SlideEffect.Right)
    PageTransitionExit({ duration: 500, curve: Curve.Ease })
      .slide(SlideEffect.Left)
  }

  build() {
    Navigation(this.pageInfos) {
      Column() {
        // Archetype 3: Spaced Tab Switch header
        Row() {
          Button('All Projects')
            .backgroundColor(this.activeTab === 0 ? '#00F0FF' : 'transparent')
            .fontColor(this.activeTab === 0 ? '#050816' : '#FFFFFF')
            .onClick(() => { this.activeTab = 0; })
            .margin({ right: 16 }) // Explicit physical margin gap

          Button('Services')
            .backgroundColor(this.activeTab === 1 ? '#00F0FF' : 'transparent')
            .fontColor(this.activeTab === 1 ? '#050816' : '#FFFFFF')
            .onClick(() => { this.activeTab = 1; })
        }
        .padding(16)
        .width('100%')

        Scroll() {
          Column({ space: 16 }) {
            // Archetype 4: Component Lifecycle reveal (TransitionEffect.asymmetric)
            Text('Featured Case Studies')
              .fontSize(22)
              .fontWeight(FontWeight.Bold)
              .fontColor('#FFFFFF')
              .transition(
                TransitionEffect.asymmetric(
                  TransitionEffect.OPACITY
                    .combine(TransitionEffect.scale({ x: 0.95, y: 0.95 })),
                  TransitionEffect.OPACITY
                    .combine(TransitionEffect.move(TransitionEdge.BOTTOM))
                )
              )

            // Archetype 1: Grid Cards with geometryTransition shared element morphing
            ProjectCard({
              cardId: 'card_seo_engine',
              title: 'Enterprise SEO & Growth Engine',
              category: 'SEO & Web Tech',
              description: 'Zero-CLS website architecture targeting 100/100 Core Web Vitals.',
              onCardClick: (id: string) => {
                this.pageInfos.pushPathByName('ProjectDetail', id);
              }
            })

            ProjectCard({
              cardId: 'card_ai_concierge',
              title: 'AI Portfolio Concierge',
              category: 'AI Workflows',
              description: 'Interactive intelligent user engagement surface.',
              onCardClick: (id: string) => {
                this.pageInfos.pushPathByName('ProjectDetail', id);
              }
            })

            // Archetype 5: Trigger Bottom Sheet
            Button('Inquire Services')
              .width('100%')
              .height(48)
              .backgroundColor('#7000FF')
              .fontColor('#FFFFFF')
              .borderRadius(24)
              .margin({ top: 12 })
              .onClick(() => {
                this.isSheetOpen = true;
              })
              .bindSheet($$this.isSheetOpen, this.BottomSheetBuilder(), {
                height: SheetSize.MEDIUM,
                dragBar: true,
                blurStyle: BlurStyle.Thin
              })
          }
          .padding(16)
        }
      }
      .width('100%')
      .height('100%')
      .backgroundColor('#050816')
    }
    .navDestination(this.PageMap)
    .mode(NavigationMode.Stack)
  }

  @Builder
  BottomSheetBuilder() {
    BottomSheetContent({
      title: 'Get In Touch',
      onClose: () => {
        this.isSheetOpen = false;
      }
    })
  }
}
