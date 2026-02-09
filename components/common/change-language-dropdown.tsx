import { useEffect, useState } from 'react'

import { LANGUAGE_OPTIONS } from '@/constants'
import i18next from '@/locales'
import useStore from '@/store'
import { LanguageProps } from '@/types'
import InlineDropdown from './inline-dropdown'


export default function ChangeLanguageDropdown({ label }: { label?: string }) {
    const { setActionName, currentLanguage } = useStore()
    const [language, setLanguage] = useState<LanguageProps>(currentLanguage)

    useEffect(() => {
        setActionName('currentLanguage', language)
        i18next.changeLanguage(language)
    }, [language, setActionName])

    return (
        <InlineDropdown
            selects={LANGUAGE_OPTIONS}
            selected={language}
            setSelected={(value) => setLanguage(value as LanguageProps)}
        >
            <InlineDropdown.Label text={label} />
            <InlineDropdown.Input />
        </InlineDropdown>
    )
}

