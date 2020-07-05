import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel';

export default class Dashboard extends Component {
    render() {
        return (
            <Carousel>
            <Carousel.Item>
            <iframe 
            frameborder="0"  
            scrolling="vertical" 
            width="450" height="300" 
            src="https://www.fctables.com/england/premier-league/iframe/?type=table&lang_id=2&country=67&template=10&team=&timezone=Pacific/Midway&time=24&po=1&ma=1&wi=1&dr=1&los=1&gf=1&ga=1&gd=1&pts=1&ng=0&form=0&width=430&height=300&font=Verdana&fs=11&lh=22&bg=FFFFFF&fc=333333&logo=1&tlink=1&scfs=22&scfc=333333&scb=1&sclg=1&teamls=80&ths=1&thb=1&thba=FFFFFF&thc=000000&bc=dddddd&hob=f5f5f5&hobc=ebe7e7&lc=333333&sh=1&hfb=1&hbc=3bafda&hfc=FFFFFF"></iframe>
            </Carousel.Item>
            <Carousel.Item>
            <iframe 
            frameborder="0"  
            scrolling="vertical" 
            width="450" height="300" 
            src="https://www.fctables.com/england/premier-league/iframe=/?type=top-scorers&lang_id=2&country=67&template=10&team=&timezone=America/New_York&time=24&limit=30&ppo=1&pte=1&pgo=1&pma=1&pas=1&ppe=1&width=450&height=300&font=Verdana&fs=11&lh=20&bg=FFFFFF&fc=333333&logo=1&tlink=1&ths=1&thb=1&thba=FFFFFF&thc=000000&bc=dddddd&hob=f5f5f5&hobc=ebe7e7&lc=333333&sh=1&hfb=1&hbc=3bafda&hfc=FFFFFF"></iframe>
            </Carousel.Item>
            <Carousel.Item>
            <iframe 
            frameborder="0"  
            scrolling="vertical" 
            width="450" height="300" 
            src="https://www.fctables.com/england/premier-league/iframe/?type=league-scores&lang_id=2&country=67&template=10&team=180231&timezone=America/New_York&time=24&width=450&height=400&font=Verdana&fs=11&lh=20&bg=FFFFFF&fc=333333&logo=1&tlink=1&scoreb=f4454f&scorefc=FFFFFF&sgdcoreb=8f8d8d&sgdcorefc=FFFFFF&sh=1&hfb=1&hbc=3bafda&hfc=FFFFFF"></iframe>
            </Carousel.Item>
            <Carousel.Item>
            <iframe 
            frameborder="0"  
            scrolling="no" 
            width="450" height="170" 
            src="https://www.fctables.com/teams/arsenal-180231/iframe/?type=team-last-match&lang_id=2&country=67&template=10&team=180231&timezone=America/New_York&time=24&width=450&height=150&font=Verdana&fs=11&lh=20&bg=FFFFFF&fc=333333&logo=1&tlink=1&scfs=22&scfc=333333&scb=1&sclg=1&teamls=80&sh=1&hfb=1&hbc=3bafda&hfc=FFFFFF"></iframe>
            
            <iframe 
            frameborder="0"  
            scrolling="no" 
            width="450" height="170" 
            src="https://www.fctables.com/teams/arsenal-180231/iframe/?type=team-next-match&lang_id=2&country=67&template=10&team=180231&timezone=America/New_York&time=24&width=450&height=150&font=Verdana&fs=11&lh=20&bg=FFFFFF&fc=333333&logo=1&tlink=1&scfs=22&scfc=333333&scb=1&sclg=1&teamls=80&sh=1&hfb=1&hbc=3bafda&hfc=FFFFFF"></iframe>
            </Carousel.Item>
            </Carousel>        
            )
    }
}
