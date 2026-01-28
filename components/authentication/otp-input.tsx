import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, TextInput, View } from 'react-native'

import ButtonComponent from '@/components/common/button-component'
import ColumnComponent from '@/components/common/column-component'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'

import { useTheme } from '@/hooks'

type OTPInputProps = {
    value: string[]
    onChange: (value: string[]) => void
    length?: number
    disabled?: boolean
    loading?: boolean
    onResendOTP?: () => void
    errorMessage?: string
    hideResend?: boolean
}

export default function OTPInput({
    value,
    onChange,
    length = 5,
    disabled = false,
    loading = false,
    onResendOTP,
    errorMessage,
    hideResend = false,
}: OTPInputProps) {
    const { t } = useTranslation()
    const { colors } = useTheme()
    const inputRefs = useRef<TextInput[]>([])
    const animatedValues = useRef<Animated.Value[]>([])
    const [countdown, setCountdown] = useState(60)
    const [isResendActive, setIsResendActive] = useState(false)

    useEffect(() => {
        animatedValues.current = Array(length).fill(0).map(() => new Animated.Value(0))
    }, [length])

    useEffect(() => {
        let timer: NodeJS.Timeout | number
        if (countdown > 0 && !isResendActive) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1)
            }, 1000)
        } else if (countdown === 0) {
            setIsResendActive(true)
        }
        return () => {
            if (timer) clearInterval(timer)
        }
    }, [countdown, isResendActive])

    const handleResendOTP = () => {
        if (isResendActive && onResendOTP) {
            onResendOTP()
            setCountdown(60)
            setIsResendActive(false)
            setTimeout(() => {
                focusInput(0)
            }, 50)
        }
    }

    const focusInput = (index: number) => {
        if (inputRefs.current[index]) {
            inputRefs.current[index].focus()

            Animated.sequence([
                Animated.timing(animatedValues.current[index], {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValues.current[index], {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start()
        }
    }

    const handleChange = (text: string, index: number) => {
        const newValue = [...value]
        newValue[index] = text
        onChange(newValue)

        if (text && index < length - 1) {
            focusInput(index + 1)
        }
    }

    const handleKeyPress = (event: any, index: number) => {
        if (event.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
            focusInput(index - 1)
        }
    }

    return (
        <ColumnComponent gap={10}>
            <RowComponent justify='space-between' alignItems='center' style={{ paddingVertical: 5 }} >
                {Array(length)
                    .fill(0)
                    .map((_, index) => {
                        const animatedStyle = {
                            transform: [
                                {
                                    scale: animatedValues.current[index]?.interpolate({
                                        inputRange: [0, 0.5, 1],
                                        outputRange: [1, 1.1, 1],
                                    }) || 1,
                                },
                            ],
                        }

                        return (
                            <Animated.View key={index} style={animatedStyle}>
                                <View
                                    style={{
                                        width: 50,
                                        height: 60,
                                        borderRadius: 10,
                                    }}
                                >
                                    <TextInput
                                        ref={(ref) => {
                                            if (ref) inputRefs.current[index] = ref
                                        }}
                                        style={[
                                            {
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: 10,
                                                textAlign: 'center',
                                                fontSize: 24,
                                                fontWeight: '600',
                                                color: colors.text,
                                            },
                                            value[index] ? {
                                                backgroundColor: colors.card,
                                                borderColor: '#007BFF',
                                            } : {},
                                        ]}
                                        maxLength={1}
                                        keyboardType="number-pad"
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={(event) => handleKeyPress(event, index)}
                                        value={value[index]}
                                        editable={!disabled}
                                        selectTextOnFocus
                                        placeholder="●"
                                        placeholderTextColor={colors.outline}
                                    />
                                </View>
                            </Animated.View>
                        )
                    })}
            </RowComponent>
            {!hideResend &&
                <ButtonComponent
                    onPress={handleResendOTP}
                    textProps={{
                        text: isResendActive ? t('resend otp') : `${t('resend otp')} ${countdown}s`,
                        type: 'caption',
                        color: isResendActive ? 'primary' : 'icon',
                    }}
                    disabled={!isResendActive}
                    loading={loading}
                    isIconOnly
                />
            }
            {errorMessage && (
                <TextComponent
                    type='caption'
                    text={errorMessage}
                    color='error'
                />
            )}
        </ColumnComponent>
    )
}