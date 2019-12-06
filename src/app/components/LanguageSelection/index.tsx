import * as React from 'react';
import { I18nContext } from '../../index';

const onStyle = {
    backgroundColor: '#31702B',
};

const offStyle = {
    backgroundColor: '#D5CECE',
};

export class LanguageSelection extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                 <I18nContext.Consumer>
                    {(context) => (
                        <>
                        <button onClick={() => context.changeLanguage('np')} 
                            style={ context.language === 'np' ? onStyle : offStyle}>Nepali</button>
                        <button onClick={() => context.changeLanguage('en')} 
                            style={ context.language === 'en' ? onStyle : offStyle }>English</button>
                        </>
                    )}
                 </I18nContext.Consumer>
            </div>
        )
    }
}

export default LanguageSelection;