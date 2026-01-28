import ColumnComponent from "@/components/common/column-component"
import { useImagePicker } from "@/hooks/use-image-picker"
import { FileProps } from "@/types"
import { FlatList, View } from "react-native"
import ButtonComponent from "./button-component"
import ImageComponent from "./image-component"

type SingleModeProps = {
    isSingle: true
    value: FileProps | null
    setValue: (value: FileProps | null) => void
}

type MultiModeProps = {
    isSingle?: false
    values: FileProps[]
    setValues: (values: FileProps[]) => void
}

type CommonProps = {
    label?: string
}

type ImagePickerButtonProps = CommonProps & (SingleModeProps | MultiModeProps)

export default function ImagePickerButton(props: ImagePickerButtonProps) {
    const { openImagePicker } = useImagePicker()
    const files =
        props.isSingle
            ? (props.value ? [props.value] : [])
            : props.values

    const handleSelect = (file: FileProps) => {
        if (props.isSingle) {
            props.setValue(file)
        } else {
            props.setValues([...props.values, file])
        }
    }

    const handleRemove = (uri: string) => {
        if (props.isSingle) {
            props.setValue(null)
        } else {
            props.setValues(props.values.filter(value => value.uri !== uri))
        }
    }

    return (
        <ColumnComponent gap={12}>

            {files.length > 0 && (
                <FlatList
                    data={files}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ gap: 12 }}
                    renderItem={({ item }) => (
                        <View>
                            <ImageComponent
                                uri={item.uri}
                                style={{
                                    width: 90,
                                    height: 90,
                                    borderRadius: 8,
                                    resizeMode: 'cover',
                                }}
                                isShowViewer
                            />

                            <ButtonComponent
                                isIconOnly
                                iconProps={{ name: "Trash2", color: "white" }}
                                style={{
                                    position: "absolute",
                                    top: 5,
                                    right: 5,
                                }}
                                onPress={() => handleRemove(item.uri)}
                            />
                        </View>
                    )}
                />
            )}

            <ButtonComponent
                outline
                textProps={{ text: props.isSingle ? "select image" : "add images" }}
                iconProps={{ name: "CircleFadingArrowUp" }}
                buttonStyle={{ borderStyle: "dashed" }}
                onPress={() => {
                    openImagePicker((file) => {
                        handleSelect(file)
                    })
                }}
            />
        </ColumnComponent>
    )
}
