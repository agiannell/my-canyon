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
import './canyon.scss';

class Canyon extends Component {
    constructor() {
        super();
        this.state = {
            canyon: {}
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        const parsedID = parseInt(id);

        axios.get(`/api/canyon/${parsedID}`)
            .then(canyon => {
                this.setState({ canyon: canyon.data })
            });
    }

    deleteCanyon = (id) => {
        axios.delete(`/api/canyons/${id}`)
            .then(() => {
                alert('Canyon deleted');
                this.props.history.push('/canyons');
            })
            .catch(err => console.log(`Error: ${err.message}`));
    }

    render() {
        const { id } = this.props.match.params;
        const parsedID = parseInt(id);
        // console.log('Canyon Component', this.state); 
        // console.log('react state', this.state.canyon.canyon_id)
        const { canyon_id } = this.state.canyon;
        return (
            <>
                <Header />
                Individual Canyon Here
                <h1>{this.state.canyon.canyon_name}</h1>
                <img src={this.state.canyon.canyon_pic} alt={this.state.canyon.canyon_name} />
                <p>Add by {this.state.canyon.username}</p>
                <span>{this.state.canyon.canyon_rating}</span>
                {this.props.userID === this.state.canyon.canyon_owner
                    ? (
                        <>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<DeleteIcon />}
                                onClick={() => this.deleteCanyon(this.state.canyon.canyon_id)}
                            >
                                Delete
                            </Button>
                            <Link to={`/editcanyon/${canyon_id}`}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<FontAwesomeIcon icon={faEdit} />}
                                >
                                    Edit
                            </Button>
                            </Link>

                        </>
                    )
                    : null}

                <p>{this.state.canyon.canyon_description}</p>
                <h1>Comments</h1>
                <Comment id={parsedID} />
            </>
        );
    }
}


const mapStateToProps = reduxState => {
    return {
        userID: reduxState.userReducer.user.user_id
    }
}
export default connect(mapStateToProps)(Canyon);