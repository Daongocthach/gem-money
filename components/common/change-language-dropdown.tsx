import { useEffect, useState } from 'react'
import { ViewStyle } from 'react-native'

import i18next from '@/locales'
import useStore from '@/store'
import { LanguageProps } from '@/types'
import InlineDropdown from './inline-dropdown'


export default function ChangeLanguageDropdown({ viewStyle, label }: { viewStyle?: ViewStyle, label?: string }) {
    const { setActionName, currentLanguage } = useStore()
    const [language, setLanguage] = useState<LanguageProps>(currentLanguage)

    useEffect(() => {
        setActionName('currentLanguage', language)
        i18next.changeLanguage(language)
    }, [language, setActionName])

    return (
        <InlineDropdown
            label={label}
            selected={language}
            setSelected={(value) => setLanguage(value as LanguageProps)}
            selects={[
                { label: 'english', value: 'en' },
                { label: 'vietnamese', value: 'vi' },
                { label: 'taiwanese', value: 'zh-TW' },
                { label: 'chinese', value: 'zh-CN' },
            ]}
            hideFooter
            viewStyle={{ width: 152, ...viewStyle }}
        />
    )
}

