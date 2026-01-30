import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { showAlert } from '@/alerts'
import {
  ButtonComponent,
  CardContainer,
  ChangeLanguageDropdown,
  ColumnComponent,
  Container,
  IconComponent,
  RowComponent,
  SwitchComponent,
  TextComponent
} from '@/components'
import { VERSION_PATCH } from '@/constants'
import useStore from '@/store'


export default function SettingsScreen() {
  const { t } = useTranslation()
  const {
    darkMode,
    setDarkMode,
  } = useStore()

  const [visibleDevMode, setVisibleDevMode] = useState(false)

  const toggleSwitch = () => {
    setDarkMode(!darkMode)
  }
  return (
    <Container isScroll>
      <CardContainer gap={25}>
        <TextComponent type='title' text='system' color='primary' />

        <ColumnComponent gap={20}>
          <ChangeLanguageDropdown viewStyle={{ flexGrow: 1, width: '100%' }} label='language' />
          <RowComponent justify='space-between' alignItems='flex-end'>
            <SwitchComponent
              value={darkMode}
              onToggle={toggleSwitch}
              label='dark mode'
            />
            <IconComponent name={darkMode ? 'Moon' : 'Sun'} />
          </RowComponent>
        </ColumnComponent>
      </CardContainer>
      <ButtonComponent
        isIconOnly
        textProps={{
          text: `v1.0.${VERSION_PATCH}`,
          type: 'caption',
          color: 'onCardDisabled'
        }}
        style={{ position: 'absolute', bottom: 20, right: 20 }}
        onPress={() => showAlert('change_company', () => setVisibleDevMode(!visibleDevMode))}
      />
    </Container>
  )
}