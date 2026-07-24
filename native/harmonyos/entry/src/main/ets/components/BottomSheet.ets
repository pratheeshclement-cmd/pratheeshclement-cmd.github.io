/**
 * HARMONYOS NEXT BottomSheet Component (ArkTS / ArkUI)
 * Archetype 5: Modal / Sheet Transitions with bindSheet
 */

@Component
export struct BottomSheetContent {
  @Prop title: string = 'Service Inquiries & AI Concierge';
  onClose: () => void = () => {};

  build() {
    Column() {
      // Drag handle indicator
      Row()
        .width(40)
        .height(4)
        .backgroundColor('rgba(255, 255, 255, 0.3)')
        .borderRadius(2)
        .margin({ top: 12, bottom: 16 })

      Row() {
        Text(this.title)
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFF')

        Blank()

        Button() {
          Text('✕')
            .fontSize(16)
            .fontColor('#FFFFFF')
        }
        .backgroundColor('rgba(255, 255, 255, 0.1)')
        .width(32)
        .height(32)
        .borderRadius(16)
        .onClick(() => this.onClose())
      }
      .width('100%')
      .margin({ bottom: 20 })

      Text('Directly request custom SEO audits, website builds, and growth marketing packages.')
        .fontSize(15)
        .fontColor('#94A3B8')
        .margin({ bottom: 24 })

      Button('Send Message')
        .width('100%')
        .height(48)
        .backgroundColor('#00F0FF')
        .fontColor('#050816')
        .fontWeight(FontWeight.Bold)
        .borderRadius(24)
        .onClick(() => this.onClose())
    }
    .padding(24)
    .width('100%')
    .backgroundColor('#0B0F23')
    .borderRadius({ topLeft: 24, topRight: 24 })
  }
}
