import { Component } from 'react';
import Header from '../../Components/Header/Header';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import Comment from '../../Components/Comments/Comment';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Spinner from '../Spinner/Spinner';
import './canyon.scss';

class Canyon extends Component {
    constructor() {
        super();
        this.state = {
            canyon: {},
            weather: []
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        const parsedID = parseInt(id);

        axios.get(`/api/canyon/${parsedID}`)
            .then(canyon => {
                this.setState({ canyon: canyon.data })
            });

            // this.getWeather();
    }

    deleteCanyon = (id) => {
        axios.delete(`/api/canyons/${id}`)
            .then(() => {
                alert('Canyon deleted');
                this.props.history.push('/canyons');
            })
            .catch(err => console.log(`Error: ${err.message}`));
    }

    getWeather = () => {
        const zipcode = 72762;
        axios.post('/api/weather', { zipcode })
            .then(res => this.setState({ weather: res.data }))
            .catch(err => console.log(`Client Error: ${err.message}`));
    }

    render() {
        const { id } = this.props.match.params;
        const parsedID = parseInt(id);
        // console.log('Canyon Component', this.props);
        // console.log('react state', this.state.canyon.canyon_id)
        console.log(this.state.canyon)
        console.log('weather:',this.state.weather)
        const { canyon_id } = this.state.canyon;
        return (
            <>
                <Header />
                {this.props.loading
                    ?
                    (
                        <Spinner />
                    )
                    :
                    (
                        <section className="canyon-container">
                            <Container className='canyon-content' fixed>
                                <Typography className='heading canyon-heading-name' variant="h3">
                                    {this.state.canyon.canyon_name}
                                </Typography>
                                <img className='canyon-img' src={this.state.canyon.canyon_pic} alt={this.state.canyon.canyon_name} />
                                <section className="canyon-owner-details">
                                    <span className="canyon-owner">Added by @{this.state.canyon.username}</span>
                                    <span className="canyon-rating">Rating: {this.state.canyon.canyon_rating}</span>
                                    {this.props.userID === this.state.canyon.canyon_owner
                                        ? (
                                            <>
                                                <Button
                                                    className="delete-canyon-btn"
                                                    variant="contained"
                                                    color="secondary"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => this.deleteCanyon(this.state.canyon.canyon_id)}
                                                >
                                                    Delete
                                        </Button>
                                                <Link className="link" to={`/editcanyon/${canyon_id}`}>
                                                    <Button
                                                        className="edit-canyon-btn"
                                                        variant="contained"
                                                        startIcon={<FontAwesomeIcon icon={faEdit} />}
                                                    >
                                                        Edit
                                        </Button>
                                                </Link>

                                            </>
                                        )
                                        : null}
                                </section>
                                <button onclick={() => this.getWeather()}>click me</button>
                                <article className="canyon-description">"{this.state.canyon.canyon_description}"</article>
                                <h1>Comments</h1>
                                <Comment id={parsedID} />
                            </Container >
                        </section >
                    )
                }
            </>
        );
    }
}


const mapStateToProps = reduxState => {
    return {
        userID: reduxState.userReducer.user.user_id,
        loading: reduxState.canyonReducer.isLoading
    }
}
export default connect(mapStateToProps)(Canyon);