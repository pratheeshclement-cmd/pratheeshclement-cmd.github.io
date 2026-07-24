/**
 * HARMONYOS NEXT ProjectDetail Page (ArkTS / ArkUI)
 * Receives shared element long-take morphing via geometryTransition(cardId)
 */

@Entry
@Component
export struct ProjectDetail {
  @State cardId: string = 'card_1';
  @State title: string = 'Enterprise SEO & Growth Engine';
  @State category: string = 'SEO & Growth';

  build() {
    NavDestination() {
      Scroll() {
        Column() {
          // Morph target image sharing geometryTransition id
          Image($r('app.media.project_preview'))
            .width('100%')
            .height(300)
            .objectFit(ImageFit.Cover)
            .geometryTransition(this.cardId)
            .clip(true)

          Column() {
            Text(this.category)
              .fontSize(14)
              .fontColor('#00F0FF')
              .margin({ top: 16, bottom: 8 })

            Text(this.title)
              .fontSize(26)
              .fontWeight(FontWeight.Bold)
              .fontColor('#FFFFFF')
              .margin({ bottom: 12 })

            Text('Full-stack performance optimization, custom structured data graph architecture, AI content pipeline, and zero-CLS web infrastructure targeting 100/100 Core Web Vitals.')
              .fontSize(16)
              .fontColor('#CBD5E1')
              .lineHeight(24)
          }
          .padding(20)
          .alignItems(HorizontalAlign.Start)
        }
      }
      .width('100%')
      .height('100%')
      .backgroundColor('#050816')
    }
    .title('Project Details')
  }
}
