import Api from './Api'
import Images from './Images'
import Colors from './Colors'
import NavUtils from './NavUtils'
import Request from './Request'
import Security from './Security'
import Emiter from './Emiter'
import NetImg from './NetImg'

import Common from './Common'

const MyUtils = {
    get Api() { return Api; },
    get Images() { return Images; },
    get Colors() { return Colors; },
    get Request() { return Request; },
    get NavUtils() { return NavUtils; },
    get Security() {return Security;},
    get Oss() {return Oss},
    get Emiter() {return Emiter;},
    get NetImg() {return NetImg;},
    get Common() {return Common;}
}

module.exports = MyUtils;