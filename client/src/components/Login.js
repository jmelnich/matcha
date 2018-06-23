import React, {Component} from 'react'
import {Form, Input, Button} from 'antd'
import {connect} from 'react-redux'
import {getUser} from '../actions/userActions'
import PropTypes from 'prop-types'


class Login extends Component {
    state = {
        email: '',
        password: ''
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    onSubmit = (e) => {
        e.preventDefault();
        const {getUser} = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                getUser(values).then(
                    (res) => {
                        console.log('Response from back', res);
                    }
                );
            }
        });
        console.log(this.state);
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout      = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16}
            }
        };
        return (
            <div>
                <Form className="App-form" onSubmit={this.onSubmit}>
                    <Form.Item {...formItemLayout} label='E-mail'> {
                        getFieldDecorator('email', {
                            rules: [{
                                type: 'email',
                                message: 'e-mail is not valid'
                            },
                                {
                                    required: true,
                                    message: 'Please input your E-mail'
                                }]
                        })(<Input name='email'
                                  onChange={e => this.onChange(e)}/>)
                    }
                    </Form.Item>
                    <Form.Item {...formItemLayout} label='Password'> {
                        getFieldDecorator('password', {
                            rules: [{
                                required: true,
                                message: 'Please input your password'
                            }]
                        })(<Input name='password' type='password'
                                  onChange={e => this.onChange(e)}/>)
                    }
                    </Form.Item>
                    <Button className="App-button" type='primary' htmlType='submit'>Login</Button>
                </Form>
            </div>
        )
    }
}

Login.propTypes = {
    getUser: PropTypes.func.isRequired
};

export default connect(null, {getUser})(Form.create()(Login));