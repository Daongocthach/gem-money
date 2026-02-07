import {
  CardContainer,
  ChangeLanguageDropdown,
  ColumnComponent,
  Container,
  IconComponent,
  RowComponent,
  SwitchComponent,
  TextComponent
} from '@/components'
import useStore from '@/store'


export default function SettingsScreen() {
  const {
    darkMode,
    setDarkMode,
  } = useStore()

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
              label='dark_mode'
            />
            <IconComponent name={darkMode ? 'Moon' : 'Sun'} />
          </RowComponent>
        </ColumnComponent>
      </CardContainer>
    </Container>
  )
}