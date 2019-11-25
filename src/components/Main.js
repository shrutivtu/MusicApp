import React from 'react';
import '../App.css';
let flag = false;
let max = 9, min = 1, track='',image='',shuffle;
class Main extends React.Component{
    state = {
        playing: false,
        currentTrack: '',
        currentImage: '',
        currentId: 1,
        shuffle:false,
        loop: false,
        playwidth:0
    }
    componentDidUpdate(){
        if(this.state.currentTrack) {
            this.player.src = this.state.currentTrack;
            this.player.play()
        }
        if(this.state.playing){
            if(this.state.currentTrack === ''){
                this.player.src = this.props.musicdata[0].file;
                this.player.play();
            }else{
            this.player.src = this.state.currentTrack;
            this.player.play();
            }
        }else{
            this.player.pause();
        }
    }
    songHandler = (id) => {
        let currentSong = '';
        flag = true;
        if(this.props.musicdata.length > 0){
            for(let i = 0; i < this.props.musicdata.length; i++){
                if(id === this.props.musicdata[i].id){
                    currentSong = this.props.musicdata[i].file;
                    this.setState({
                        playing:true,
                        currentTrack: currentSong,
                        currentImage: this.props.musicdata[i].albumCover,
                        currentId: this.props.musicdata[i].id
                    });
                }
            }
        }
    }
    shuffleHandler = () => {
        flag = true;
        let random = Math.floor(Math.random() * (+max - +min)) + +min;
        if(this.props.musicdata.length > 0){
            this.setState({
                playing: true,
                currentTrack: this.props.musicdata[random - 1].file,
                currentImage: this.props.musicdata[random - 1].albumCover,
                currentId: this.props.musicdata[random - 1].id
            })
        }
    }
    prevsongHandler = () => {
        let value = 0;
        if(this.props.musicdata.length > 0){
            flag = true;
            if(this.state.currentId > 1){
                value = this.state.currentId -1;
                track = this.props.musicdata[value - 1].file;
                image = this.props.musicdata[value - 1].albumCover;
                this.setState({
                    currentId: value,
                    playing: true,
                    currentTrack: track,
                    currentImage: image
                })
            }else if(this.state.currentId === 1){
                value = 8
                track = this.props.musicdata[value - 1].file;
                image = this.props.musicdata[value - 1].albumCover;
                this.setState({
                    currentId: value,
                    playing: true,
                    currentTrack: track,
                    currentImage: image
                });
            }   
        }
    }
    playpauseHandler = () => {
        this.setState((prevState) => ({
            playing: !prevState.playing
        }));
    }
    nextsongHandler = () => {
        let value = 0;
        if(this.props.musicdata.length > 0){
            flag = true;
            if(this.state.currentId < 8){
                value = this.state.currentId + 1;
                track = this.props.musicdata[value-1].file;
                image = this.props.musicdata[value-1].albumCover;
                this.setState({
                    currentId: value,
                    playing: true,
                    currentTrack: track,
                    currentImage: image
                })
            }else if(this.state.currentId === 8){
                value = 1
                track = this.props.musicdata[value - 1].file;
                image = this.props.musicdata[value - 1].albumCover;
                this.setState({
                    currentId: value,
                    playing: true,
                    currentTrack: track,
                    currentImage: image
                });
            }   
        }
    }
    loopHandler = () => {
        this.setState((prevState) => ({
            currentId: prevState.currentId,
            playing: true,
            loop: !prevState.loop,
            currentTrack: prevState.currentTrack,
            currentImage: prevState.currentImage
        }));
    }
    controlHandler = () => {
        shuffle=this.state.shuffle;
        if(!shuffle === true){
            this.shuffleHandler();
        }
        this.setState({
            shuffle: !shuffle
        })
    }
    prevHandler = () => {
        if(this.state.shuffle === true && this.state.loop === false){
            this.shuffleHandler();
        }else if(this.state.loop === true && this.state.shuffle === false){
            this.loopHandler();
        }else{
            this.prevsongHandler();
        }
    }
    nextHandler = () => {
        if(this.state.shuffle === true && this.state.loop === false){
            this.shuffleHandler();
        }else if(this.state.loop === true && this.state.shuffle === false){
            this.loopHandler();
        }else{
            this.nextsongHandler();
        }
    }
    timeupdate = (event) => {
        const audio = document.querySelector('audio');
        const pbar = document.querySelector('.pbar');
        if(!audio.ended){
            const percent = (audio.currentTime / audio.duration) * 100;
            pbar.style.width = `${percent}%`;
        }else{
            this.nextHandler();
        }
    }
    render(){
        return(
            <div className="container">
                <div className="leftSide">
                    <div className="bigimagesec">
                      { flag === true ? <img src = {this.state.currentImage} alt='' className="bigimage"/> : <img src = {this.props.musicdata.length>0?this.props.musicdata[0].albumCover:''} alt='' className="bigimage"/> }
                    </div>
                    <div className="audiosection">
                        <audio ref={ref => this.player = ref} src="#" onTimeUpdate={this.timeupdate}/>
                        <div className="playerwrapper">
                            <div className="pbar" style={{width:isNaN(this.state.playwidth)?`1%`:this.state.playwidth}}></div>
                        </div>
                        
                        <div className="controllersec">

                            <i className={this.state.shuffle === false ? ["fa", "fa-random", "shuffle"].join(" "):["fa", "fa-random", "shuffle","shuffleactive"].join(" ")} onClick={this.controlHandler}></i>

                            <i className={["fas", "fa-angle-left","previous"].join(" ")} onClick={this.prevHandler}></i>

                            {this.state.playing === false ? <i className={["fa", "fa-play", "playpause"].join(" ")} onClick={this.playpauseHandler}></i> : <i className={["fa", "fa-pause", "playpause"].join(" ")} onClick={this.playpauseHandler}></i>}

                            <i className={["fas", "fa-angle-right", "next"].join(" ")} onClick={this.nextHandler}></i>

                            <i className={this.state.loop === false ? ["fas", "fa-undo", "loop"].join(" "): ["fas", "fa-undo", "loop", "loopactive"].join(" ")} onClick={this.loopHandler}></i>

                        </div>
                    </div>
                </div>
                <div className="rightSide">
                    {
                        this.props.musicdata === null || this.props.musicdata.length === 0 ? [] : this.props.musicdata.map(item => {
                            return(
                                <div className="musiccard" key={item.id} onClick={() => {this.songHandler(item.id)}}>
                                    <div className="imgsec">
                                        <img src={item.albumCover} alt='' className="miniimage"/>
                                    </div>
                                    <div className="songdetail">
                                        <h3 className="songheading">{item.track}</h3>
                                        <p className="artistheading">{item.artist}</p>
                                    </div>
                                </div>
                            );
                        }) 
                    }
                </div>
            </div>
        )
    }
}
export default Main;