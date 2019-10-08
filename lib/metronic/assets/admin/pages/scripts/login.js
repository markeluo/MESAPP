var Login = function() {
 
    var handleLogin = function() {

        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                remember: {
                    required: false
                }
            },
            messages: {
                username: {
                    required: "用户名不可为空!"
                },
                password: {
                    required: "密码不可为空"
                }
            },
            invalidHandler: function(event, validator) { //display error alert on form submit   
                $('.alert-danger', $('.login-form')).show();
            },

            highlight: function(element) { // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },
            submitHandler: function(form) {
                form.submit(); // form validation success, call ajax form submit
            }
        });

        $(".login-form button.uppercase").click(function (ev) {
            loginFormSubmit();
        });

        $('.login-form input').keypress(function(e) {
            if (e.which == 13) {
                loginFormSubmit();
                return false;
            }
        });

        var loginFormSubmit = function () {
            //验证表单，若通过则提交表单
            var formvalidata = $('.login-form').validate();
            if (formvalidata.form()) {
                //表单数据
                var formdata = $('.login-form').serialize();
                $.getJSON("/Login/Login"
                    , formdata
                    , function (data) {
                        if (data.Code == 200) {
                            window.location.href = "/Home/Index";
                        } else {
                            $(".alert.alert-danger>span").html(data.Message).parent().css({ "display": "block" });
                        }
                    });
            } else {
                $(".alert.alert-danger>span").html(formvalidata.errorList[0].message).parent().css({ "display": "block" });
            }
            return false;
        }
    }

    var handleForgetPassword = function() {
        $('.forget-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                email: {
                    required: true,
                    email: true
                }
            },

            messages: {
                email: {
                    required: "Email is required."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   

            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function(form) {
                form.submit();
            }
        });

        $('.forget-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.forget-form').validate().form()) {
                    $('.forget-form').submit();
                }
                return false;
            }
        });

        jQuery('#forget-password').click(function() {
            jQuery('.login-form').hide();
            jQuery('.forget-form').show();
        });

        jQuery('#back-btn').click(function() {
            jQuery('.login-form').show();
            jQuery('.forget-form').hide();
        });

    }

    var handleRegister = function() {

        function format(state) {
            if (!state.id) return state.text; // optgroup
            return "<img class='flag' src='../../assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
        }

        if (jQuery().select2) {
	        $("#select2_sample4").select2({
	            placeholder: '<i class="fa fa-map-marker"></i>&nbsp;Select a Country',
	            allowClear: true,
	            formatResult: format,
	            formatSelection: format,
	            escapeMarkup: function(m) {
	                return m;
	            }
	        });
 
	        $('#select2_sample4').change(function() {
	            $('.register-form').validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
	        });
    	}

        $('.register-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                fullname: {
                    required: true
                },
                email: {
                    required: false,
                    email: true
                },
                address: {
                    required: false
                },
                city: {
                    required: false
                },
                country: {
                    required: false
                },
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                rpassword: {
                    equalTo: "#register_password"
                },
                tnc: {
                    required: true
                }
            },

            messages: { // custom messages for radio buttons and checkboxes
                fullname: {
                    required: "姓名不可为空!"
                },
                username: {
                    required: "账号不可为空!"
                },
                password: {
                    required: "密码不可为空!"
                },
                equalTo: {
                    required:"请再次确认密码!"
                }, 
                tnc: {
                    required: "需要先同意服务条款和隐私政策."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   

            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                if (element.attr("name") == "tnc") { // insert checkbox errors after the container                  
                    error.insertAfter($('#register_tnc_error'));
                } else if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(element.closest('.input-icon'));
                } else {
                    error.insertAfter(element);
                }
            },

            submitHandler: function(form) {
                form.submit();
            }
        });

        $('.register-form input').keypress(function(e) {
            if (e.which == 13) {
                regionSubmit();
                return false;
            }
        });

        jQuery('#register-submit-btn').click(function () {
            regionSubmit();
            return false;
        }); 

        jQuery('#register-btn').click(function() {
            jQuery('.login-form').hide();
            jQuery('.register-form').show();
        });
        jQuery('#register-back-btn').click(function() {
            jQuery('.login-form').show();
            jQuery('.register-form').hide();
        });

        //注册提交
        function regionSubmit() {
            if ($('.register-form').validate().form()) {
                var regformdata = {
                    Account: $('.register-form').find("input[name='username']").val(),
                    Password: $('.register-form').find("input[name='password']").val(),
                    Name: $('.register-form').find("input[name='fullname']").val(),
                    Sex: $('.register-form').find(".md-radiobtn:checked").val(),
                    Status:1
                };

                $.post("/Login/Register",
                    regformdata,
                    function (data) {
                        if (data.Code == 200) {
                            regionTips(true, "注册成功，请联系管理员激活账号!");
                        } else {
                            regionTips(false, data.Message);
                        }
                    },
                    "json");
            }
        }

        function regionTips(bolsucces, message) {
            var type = "success";
            if (!bolsucces) {
                type = "danger";
            }
            Metronic.alert({
                container: "#register_tips", // alerts parent container(by default placed after the page breadcrumbs)
                place: "prepend", // append or prepent in container 
                type: type,  // alert's type:success,danger,warning,info
                message: message,  // alert's message
                close: true, // make alert closable
                reset: true, // close all previouse alerts first
                focus: true, // auto scroll to the alert after shown
                closeInSeconds: 0, // auto close after defined seconds
                icon: "warning" // put icon before the message:warning,check,user,none
            });
        }
    }

    return {
        //main function to initiate the module
        init: function() {
            handleLogin();
            handleForgetPassword();
            handleRegister();
        }

    };

}();