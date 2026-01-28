import { ImageSourcePropType, ViewProps } from "react-native"

import ColumnComponent from "@/components/common/column-component"
import ImageComponent from "@/components/common/image-component"
import TextComponent from "@/components/common/text-component"

interface OverviewProps extends ViewProps {
    imageSource?: ImageSourcePropType
    title?: string
    caption?: string
}

export default function Overview({ imageSource, title, caption }: OverviewProps) {
    return (
        <ColumnComponent gap={10}>
            {imageSource &&
                <ImageComponent
                    source={imageSource}
                    style={{ width: '100%', height: 180 }}
                    resizeMode="contain"
                />
            }
            {title &&
                <TextComponent
                    text={title}
                    textAlign='center'
                    type='title'
                />
            }
            {caption &&
                <TextComponent
                    text={caption}
                    type="label"
                    textAlign='center'
                />
            }
        </ColumnComponent>
    )
}