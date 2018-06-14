import {Toast,ToastView} from './Toast';
import {Loading,LoadingView} from './Loading';
import {Auth,AuthView} from './Auth'
import Button from './Button';
import {Dialog,DialogView} from './Dialog';
import ProgressBar from './ProgressBar';
import UICell from './UICell';
import TextButton from './TextButton'
import ImageButton from './ImageButton'
import Line from './Line'

/**
 *  MyComponent create by espritblock 
 */
const MyComponent = {
    get Toast() { return Toast; },
    get ToastView() { return ToastView; },
    get Loading() { return Loading; },
    get LoadingView() { return LoadingView; },
    get Button() { return Button; },
    get ProgressBar() { return ProgressBar; },
    get Dialog() { return Dialog; },
    get DialogView() { return DialogView; },
    get UICell() { return UICell},
    get SectionIndex() {return SectionIndex},
    get Auth() { return Auth; },
    get AuthView() { return AuthView; },
    get TextButton() {return TextButton},
    get ImageButton() {return ImageButton},
    get LineView() {return Line}
}

module.exports = MyComponent;