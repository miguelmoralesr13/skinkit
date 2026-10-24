/**
 * Catálogo de skinkit — la FUENTE DE LA VERDAD para consumo por IA (generación de pantallas).
 *
 * Agrega todos los `<Name>.catalog.ts`. Cada componente nuevo DEBE registrar su spec acá,
 * y cada modificación de un componente DEBE reflejarse en su spec. Si no está en el catálogo,
 * para la IA no existe.
 */
import type { ComponentSpec, ComponentCategory } from './types'
import { CATEGORY_ORDER } from './types'
import { buttonSpec } from '../components/Button/Button.catalog'
import { buttonGroupSpec } from '../components/ButtonGroup/ButtonGroup.catalog'
import { toggleSpec } from '../components/Toggle/Toggle.catalog'
import { chipGroupSpec } from '../components/ChipGroup/ChipGroup.catalog'
import { toolbarSpec } from '../components/Toolbar/Toolbar.catalog'
import { splitButtonSpec } from '../components/SplitButton/SplitButton.catalog'
import { copyButtonSpec } from '../components/CopyButton/CopyButton.catalog'
import { cardSpec } from '../components/Card/Card.catalog'
import { inputSpec } from '../components/Input/Input.catalog'
import { textareaSpec } from '../components/Textarea/Textarea.catalog'
import { checkboxSpec } from '../components/Checkbox/Checkbox.catalog'
import { radioGroupSpec, radioSpec } from '../components/Radio/Radio.catalog'
import { switchSpec } from '../components/Switch/Switch.catalog'
import { selectSpec } from '../components/Select/Select.catalog'
import { fileUploadSpec } from '../components/FileUpload/FileUpload.catalog'
import { passwordInputSpec } from '../components/PasswordInput/PasswordInput.catalog'
import { pinInputSpec } from '../components/PinInput/PinInput.catalog'
import { timePickerSpec } from '../components/TimePicker/TimePicker.catalog'
import { radioCardGroupSpec } from '../components/RadioCardGroup/RadioCardGroup.catalog'
import { checkboxCardGroupSpec } from '../components/CheckboxCardGroup/CheckboxCardGroup.catalog'
import { fieldsetSpec } from '../components/Fieldset/Fieldset.catalog'
import { tagInputSpec } from '../components/TagInput/TagInput.catalog'
import { comboboxSpec } from '../components/Combobox/Combobox.catalog'
import { multiSelectSpec } from '../components/MultiSelect/MultiSelect.catalog'
import { editableSpec } from '../components/Editable/Editable.catalog'
import { calendarSpec } from '../components/Calendar/Calendar.catalog'
import { datePickerSpec } from '../components/DatePicker/DatePicker.catalog'
import { rangeCalendarSpec } from '../components/RangeCalendar/RangeCalendar.catalog'
import { dateRangePickerSpec } from '../components/DateRangePicker/DateRangePicker.catalog'
import { sliderSpec } from '../components/Slider/Slider.catalog'
import { ratingSpec } from '../components/Rating/Rating.catalog'
import { segmentedControlSpec } from '../components/SegmentedControl/SegmentedControl.catalog'
import { numberInputSpec } from '../components/NumberInput/NumberInput.catalog'
import { badgeSpec } from '../components/Badge/Badge.catalog'
import { avatarSpec } from '../components/Avatar/Avatar.catalog'
import { avatarGroupSpec } from '../components/AvatarGroup/AvatarGroup.catalog'
import { separatorSpec } from '../components/Separator/Separator.catalog'
import { statSpec } from '../components/Stat/Stat.catalog'
import { emptyStateSpec } from '../components/EmptyState/EmptyState.catalog'
import { timelineSpec } from '../components/Timeline/Timeline.catalog'
import { descriptionListSpec } from '../components/DescriptionList/DescriptionList.catalog'
import { codeSpec } from '../components/Code/Code.catalog'
import { tagSpec } from '../components/Tag/Tag.catalog'
import { kbdSpec } from '../components/Kbd/Kbd.catalog'
import { spinnerSpec } from '../components/Spinner/Spinner.catalog'
import { progressSpec } from '../components/Progress/Progress.catalog'
import { skeletonSpec } from '../components/Skeleton/Skeleton.catalog'
import { radialProgressSpec } from '../components/RadialProgress/RadialProgress.catalog'
import { scrollAreaSpec } from '../components/ScrollArea/ScrollArea.catalog'
import { meterSpec } from '../components/Meter/Meter.catalog'
import { aspectRatioSpec } from '../components/AspectRatio/AspectRatio.catalog'
import { visuallyHiddenSpec } from '../components/VisuallyHidden/VisuallyHidden.catalog'
import { colorSwatchSpec } from '../components/ColorSwatch/ColorSwatch.catalog'
import { marqueeSpec } from '../components/Marquee/Marquee.catalog'
import { highlightSpec } from '../components/Highlight/Highlight.catalog'
import { animatedNumberSpec } from '../components/AnimatedNumber/AnimatedNumber.catalog'
import { blockquoteSpec } from '../components/Blockquote/Blockquote.catalog'
import { sparklineSpec } from '../components/Sparkline/Sparkline.catalog'
import { resizableSpec } from '../components/Resizable/Resizable.catalog'
import { countdownSpec } from '../components/Countdown/Countdown.catalog'
import { carouselSpec } from '../components/Carousel/Carousel.catalog'
import { tabsSpec } from '../components/Tabs/Tabs.catalog'
import { tooltipSpec } from '../components/Tooltip/Tooltip.catalog'
import { alertSpec } from '../components/Alert/Alert.catalog'
import { bannerSpec } from '../components/Banner/Banner.catalog'
import { breadcrumbSpec } from '../components/Breadcrumb/Breadcrumb.catalog'
import { paginationSpec } from '../components/Pagination/Pagination.catalog'
import { disclosureSpec } from '../components/Disclosure/Disclosure.catalog'
import { treeSpec } from '../components/Tree/Tree.catalog'
import { listSpec } from '../components/List/List.catalog'
import { flowSpec } from '../components/Flow/Flow.catalog'
import { zoneCanvasSpec } from '../components/ZoneCanvas/ZoneCanvas.catalog'
import { stepperSpec } from '../components/Stepper/Stepper.catalog'
import { menuSpec } from '../components/Menu/Menu.catalog'
import { popoverSpec } from '../components/Popover/Popover.catalog'
import { commandMenuSpec } from '../components/CommandMenu/CommandMenu.catalog'
import { hoverCardSpec } from '../components/HoverCard/HoverCard.catalog'
import {
  dialogSpec,
  confirmDialogSpec,
  alertDialogSpec,
  promptDialogSpec,
} from '../components/Dialog/Dialog.catalog'
import { toastSpec } from '../components/Toast/Toast.catalog'
import { accordionSpec } from '../components/Accordion/Accordion.catalog'
import { comparisonSliderSpec } from '../components/ComparisonSlider/ComparisonSlider.catalog'
import { menubarSpec } from '../components/Menubar/Menubar.catalog'
import { backTopSpec } from '../components/BackTop/BackTop.catalog'
import { proseSpec } from '../components/Prose/Prose.catalog'
import { dataTableSpec } from '../components/DataTable/DataTable.catalog'
import { gridSpec } from '../components/Grid/Grid.catalog'
import { stackSpec } from '../components/Stack/Stack.catalog'
import { containerSpec } from '../components/Container/Container.catalog'
import { spacerSpec } from '../components/Spacer/Spacer.catalog'
import { dynamicFormSpec } from '../components/DynamicForm/DynamicForm.catalog'
import { richTextEditorSpec } from '../components/RichTextEditor/RichTextEditor.catalog'
import { videoPlayerSpec } from '../components/VideoPlayer/VideoPlayer.catalog'
import { audioPlayerSpec } from '../components/AudioPlayer/AudioPlayer.catalog'
import { filePreviewerSpec } from '../components/FilePreviewer/FilePreviewer.catalog'
import { qrCodeSpec } from '../components/QRCode/QRCode.catalog'
import { tourSpec } from '../components/Tour/Tour.catalog'
import { fieldSpec } from '../components/Field/Field.catalog'
import { inputGroupSpec } from '../components/InputGroup/InputGroup.catalog'
import { imageSpec } from '../components/Image/Image.catalog'
import { popconfirmSpec } from '../components/Popconfirm/Popconfirm.catalog'
import { topbarSpec } from '../components/Topbar/Topbar.catalog'
import { sidebarSpec } from '../components/Sidebar/Sidebar.catalog'
import { bottomNavSpec } from '../components/BottomNav/BottomNav.catalog'
import { appShellSpec } from '../components/AppShell/AppShell.catalog'

export const COMPONENT_CATALOG: ComponentSpec[] = [
  buttonSpec,
  buttonGroupSpec,
  toggleSpec,
  chipGroupSpec,
  toolbarSpec,
  splitButtonSpec,
  copyButtonSpec,
  cardSpec,
  inputSpec,
  textareaSpec,
  checkboxSpec,
  radioGroupSpec,
  radioSpec,
  switchSpec,
  selectSpec,
  fileUploadSpec,
  passwordInputSpec,
  pinInputSpec,
  timePickerSpec,
  radioCardGroupSpec,
  checkboxCardGroupSpec,
  fieldsetSpec,
  tagInputSpec,
  comboboxSpec,
  multiSelectSpec,
  editableSpec,
  calendarSpec,
  datePickerSpec,
  rangeCalendarSpec,
  dateRangePickerSpec,
  sliderSpec,
  ratingSpec,
  segmentedControlSpec,
  numberInputSpec,
  badgeSpec,
  avatarSpec,
  avatarGroupSpec,
  separatorSpec,
  spinnerSpec,
  progressSpec,
  skeletonSpec,
  radialProgressSpec,
  scrollAreaSpec,
  meterSpec,
  aspectRatioSpec,
  visuallyHiddenSpec,
  colorSwatchSpec,
  marqueeSpec,
  highlightSpec,
  animatedNumberSpec,
  blockquoteSpec,
  sparklineSpec,
  resizableSpec,
  countdownSpec,
  carouselSpec,
  statSpec,
  emptyStateSpec,
  timelineSpec,
  descriptionListSpec,
  codeSpec,
  tagSpec,
  kbdSpec,
  tabsSpec,
  breadcrumbSpec,
  paginationSpec,
  disclosureSpec,
  treeSpec,
  listSpec,
  flowSpec,
  zoneCanvasSpec,
  stepperSpec,
  menuSpec,
  popoverSpec,
  commandMenuSpec,
  hoverCardSpec,
  tooltipSpec,
  alertSpec,
  bannerSpec,
  dialogSpec,
  confirmDialogSpec,
  alertDialogSpec,
  promptDialogSpec,
  toastSpec,
  accordionSpec,
  comparisonSliderSpec,
  menubarSpec,
  backTopSpec,
  proseSpec,
  dataTableSpec,
  gridSpec,
  stackSpec,
  containerSpec,
  spacerSpec,
  dynamicFormSpec,
  richTextEditorSpec,
  fieldSpec,
  inputGroupSpec,
  imageSpec,
  popconfirmSpec,
  topbarSpec,
  sidebarSpec,
  bottomNavSpec,
  appShellSpec,
  videoPlayerSpec,
  audioPlayerSpec,
  filePreviewerSpec,
  qrCodeSpec,
  tourSpec,
]

/** Busca el spec de un componente por su nombre de import. */
export function getComponentSpec(name: string): ComponentSpec | undefined {
  return COMPONENT_CATALOG.find((c) => c.name === name)
}

export interface CatalogSection {
  category: ComponentCategory
  components: ComponentSpec[]
}

/**
 * Agrupa el catálogo por categoría, en el orden de CATEGORY_ORDER. Categorías vacías se
 * omiten. Dentro de cada sección se respeta el orden de COMPONENT_CATALOG.
 */
export function getCatalogByCategory(): CatalogSection[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    components: COMPONENT_CATALOG.filter((c) => c.category === category),
  })).filter((section) => section.components.length > 0)
}

export { CATEGORY_ORDER } from './types'
export type { ComponentSpec, ComponentCategory, PropSpec, PartSpec, ExampleSpec } from './types'
