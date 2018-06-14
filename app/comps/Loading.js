import React from 'react';
import { StyleSheet, Dimensions, Text, View, Modal, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import Common from '../utils/Common';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 *  Loading create by espritblock 
 */
export class Loading {
    
    constructor() {
    
    }

    static bind(loading, key = 'default') {
        loading && (this.map[key] = loading);
    }

    static unBind(key = 'default') {
        this.map[key] = null
        delete this.map[key];
    }

    static show(text = 'Loading...', timeout = -1, key = 'default') {
        this.map[key] && this.map[key].setState({ "isShow": true, "text": text, "timeout": timeout });
    }

    static dismis(key = 'default') {
        let th = this;
        this.map[key] && th.map[key].setState({ "isShow": false });
        setTimeout(function(){
            th.map[key] && th.map[key].setState({ "isShow": false });
        },500);
    }
}

Loading.map = {};

export class LoadingView extends React.Component {

    static propTypes = {
        type: PropTypes.string,
        color: PropTypes.string,
        textStyle: PropTypes.any,
        loadingStyle: PropTypes.any,
    };

    constructor(props) {
        super(props);
        let handle = 0;
        this.state = {
            isShow: false,
            timeout: -1,
            text: "Loading..."
        }
        Loading.bind(this, this.props.type || 'default');
    }

    componentWillUnmount() {
        clearTimeout(this.handle);
        Loading.unBind(this.props.type || 'default');
    }
    
    render() {
        clearTimeout(this.handle);
        (this.state.timeout != -1) && (this.handle = setTimeout(() => {
            Loading.dismis(this.props.type || 'default');
        }, this.state.timeout));
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.isShow}
                onRequestClose={() => { this.setState({isShow:false}) } }>
                <View style={[styles.load_box, this.props.loadingStyle]}>
                    <ActivityIndicator animating={true} color={this.props.color || '#FFF'} size={'large'} style={styles.load_progress} />
                    <Text style={[styles.load_text, this.props.textStyle]}>{this.state.text}</Text>
                </View>
            </Modal>
        );
    }
}


const styles = StyleSheet.create({
    load_box: {
        width: Common.scaleSize(90),
        height: Common.scaleSize(90),
        backgroundColor: '#0008',
        alignItems: 'center',
        marginLeft: SCREEN_WIDTH / 2 - Common.scaleSize(45),
        marginTop: SCREEN_HEIGHT / 2 - Common.scaleSize(45),
        borderRadius: 5
    },
    load_progress: {
        position: 'absolute',
        width: Common.scaleSize(90),
        height: Common.scaleSize(76)
    },
    load_text: {
        marginTop:  Common.scaleSize(60),
        color: '#FFF',
        fontSize:Common.scaleSize(14),
    }
});