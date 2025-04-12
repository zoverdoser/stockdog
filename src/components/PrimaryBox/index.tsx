import { forwardRef } from 'react'
import styles from './index.module.scss'

interface PrimaryBoxProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
}

const PrimaryBox = forwardRef<HTMLDivElement, PrimaryBoxProps>(
  ({ children, prefixIcon, suffixIcon, ...restProps }, ref) => {
    return (
      <div
        className={styles.primaryBox}
        {...restProps}
        ref={ref}
      >
        {prefixIcon && (
          <span
            className={styles.icon}
            style={{ marginRight: 4 }}
          >
            <div>{prefixIcon}</div>
          </span>
        )}
        {children}
        {suffixIcon && (
          <span
            className={styles.icon}
            style={{ marginLeft: 4 }}
          >
            {suffixIcon}
          </span>
        )}
      </div>
    )
  }
)

PrimaryBox.displayName = 'PrimaryBox'

export default PrimaryBox
