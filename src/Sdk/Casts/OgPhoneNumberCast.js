import OgResourceCast from '../../Libs/Resources/OgResourceCast'

export default class OgPhoneNumberCast extends OgResourceCast {
  static format(number) {
    number = number.replace(/[^0-9]/gi, '')
    switch (number.length) {
      case 10:
        return number.replace(/^(\d{3})(\d{3})(\d{4})/gs, '($1) $2-$3')
      case 11:
        return number.replace(/^(\d)(\d{3})(\d{3})(\d{4})/gs, '+$1 ($2) $3-$4')
      case 12:
        return number.replace(
          /^(\d){2}(\d{3})(\d{3})(\d{4})/gs,
          '+$1 ($2) $3-$4'
        )
      default:
        return number
    }
  }

  toString() {
    return OgPhoneNumberCast.format(this.$value)
  }
}
