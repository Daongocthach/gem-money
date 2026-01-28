import IMAGES from '@/assets/images'
import ImageComponent from '@/components/common/image-component'
import TextComponent from '@/components/common/text-component'
import ColumnComponent from './column-component'

const ComingSoon = () => {
  return (
    <ColumnComponent gap={20}>
      <TextComponent
        text='feature in development'
        type='display'
        color={'primary'}
        textAlign='center'
      />
      <TextComponent
        text='we are currently developing this feature to provide a better user experience. please check back later for the latest updates'
        textAlign='center'
        type='caption'
      />
      <ImageComponent
        source={IMAGES.COMING_SOON_BANNER}
        style={{ width: '100%', height: 200 }}
        resizeMode='contain'
      />
    </ColumnComponent>
  )
}

export default ComingSoon
