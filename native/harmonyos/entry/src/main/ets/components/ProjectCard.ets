/**
 * HARMONYOS NEXT ProjectCard Component (ArkTS / ArkUI)
 * Archetype 1: Long-Take Morphing via geometryTransition(id)
 */

@Component
export struct ProjectCard {
  @Prop cardId: string = 'card_1';
  @Prop title: string = 'Project Title';
  @Prop category: string = 'SEO & Growth';
  @Prop description: string = 'High conversion digital ecosystem and performance marketing system.';
  @Prop coverImg: string = 'app.media.project_preview';
  
  onCardClick: (id: string) => void = () => {};

  build() {
    Column() {
      // Thumbnail image with shared element morph identifier
      Image($r(this.coverImg))
        .width('100%')
        .height(180)
        .objectFit(ImageFit.Cover)
        .borderRadius(16)
        .geometryTransition(this.cardId)
        .clip(true)

      Column() {
        Text(this.category)
          .fontSize(12)
          .fontColor('#00F0FF')
          .margin({ top: 8, bottom: 4 })

        Text(this.title)
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFF')
          .margin({ bottom: 6 })

        Text(this.description)
          .fontSize(14)
          .fontColor('#94A3B8')
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
      }
      .alignItems(HorizontalAlign.Start)
      .padding(12)
    }
    .width('100%')
    .backgroundColor('#0B0F23')
    .borderRadius(20)
    .border({ width: 1, color: 'rgba(255, 255, 255, 0.1)' })
    .onClick(() => {
      if (this.onCardClick) {
        this.onCardClick(this.cardId);
      }
    })
  }
}
