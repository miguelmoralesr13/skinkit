export type { SkinkitMessages, SkinkitMessagesOverrides, SkinkitBuiltinLocale } from './types'
export { es as skinkitMessagesEs } from './es'
export { en as skinkitMessagesEn } from './en'
export {
  SKINKIT_MESSAGES,
  DEFAULT_SKINKIT_LOCALE,
  SkinkitI18nProvider,
  useSkinkitI18n,
  useSkinkitMessages,
  formatMessage,
  mergeMessages,
  resolveBuiltinLocale,
} from './context'
export type { SkinkitI18n, SkinkitI18nProviderProps } from './context'
