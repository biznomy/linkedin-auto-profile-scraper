var extensionId = "dlnjpkndgdgmpcdcfmceofiiaelclpdk";
var profileURL = "https://www.linkedin.com/in/";
var SELECTOR = {
    profileCard: ".profile-view-grid .pv-top-card-section",
    img: ".pv-top-card-section__image",
    name: ".pv-top-card-section__name",
    headline: ".pv-top-card-section__headline",
    company1: ".pv-top-card-section__company",
    school: ".pv-top-card-section__school",
    location: ".pv-top-card-section__location",
    actionsBox: ".pv-top-card-section__actions",
    section__body: ".pv-top-card-section__body",
    section__information: ".pv-top-card-section__information",
    bizform: ".pv-top-card-section__body ul.bizform",
    personDetails: ".pv-top-card-section__information.mt3",
    company: {
        actionBar: ".org-top-card-module__company-actions-bar .org-top-card-actions",
        isCom: ".company-main-info-company-descriptions",
        title: ".org-top-card-module__details .org-top-card-module__name",
        logo: ".org-top-card-module__container .org-top-card-module__logo",
        about: ".org-about-us-organization-description .org-about-us-organization-description__text.description",
        specailites: ".org-about-company-module__org-info .org-about-company-module__specialities",
        website: ".org-about-company-module__org-info .org-about-company-module__company-page-url a",
        size: ".org-about-company-module__org-info .org-about-company-module__staff-count-range",
        founded: ".org-about-company-module__org-info .org-about-company-module__founded-year",
        industry: ".org-about-company-module__org-info .org-about-company-module__industry",
        hq: ".org-about-company-module__org-info .org-about-company-module__headquarter"
    },
    activity: {
        isActivity: "#detail-recent-activity",
        activity: ".feed-s-post-meta.feed-s-post-meta--is-not-sponsored.ember-view",
        feed: '.feed-s-update.feed-s-update--share.ember-view'
    },
    connect: {
        btn: ".connect.primary.top-card-action.ember-view",
        isMsg : '.core-rail.msg-messaging-container__core-rail',
        addnote: '.send-invite__actions button.button-secondary-large',
        textarea: '#custom-message',
        sendInvite: '.send-invite__actions button.button-primary-large.ml3',
        isPending: '.invitation-pending.primary.ember-view',
        isConnect: '.message-anywhere-button.message.primary.top-card-action.link-without-visited-state',
        msgBtn : '.message-anywhere-button.message.primary.top-card-action.link-without-visited-state',
        msgBoxFix : '.ml4.msg-overlay-conversation-bubble.ember-view',
        msgListShowPanel : '.msg-overlay-bubble-content.msg-overlay-conversation-bubble__content, .msg-overlay-conversation-bubble__new-conversation-body',
        msgTextArea: '.ember-text-area.msg-messaging-form__message.msg-messaging-form__message--chat.ember-view', 
        msgTextArea2 : '.msg-compose-form.msg-compose-form--chat.ember-view',
        msgTextArea2sub : '.msg-compose-form__message-text',
        msgPageCompose: '.msg-compose-form.msg-compose-form--chat.ember-view',
        msgPageList : '.msg-conversation-listitem.msg-conversations-container__convo-item',
        beforeMsgPaneTitle : '.global-title-container.shared-title-bar.msg-title-bar.ember-view',
        beforeMsgPaneBtn : '.msg-thread__topcard-overflow-icon.svg-icon-wrap',
        msg: "Hello,\n" + "Though we don't know each other personally, would like to connect as we are reaching out to like minded technology enthusiasts and build professional relationship. In case you are not interested, please ignore this invite. We promise not to bother you again.",
    }
};

var createdBy = {
    'createdBy' : '58f75154eaa3bcef71284a91'
}

var actions = [
    'Edit',
    'Copy',
    'Save'
];
var LINKEDIN = {
    currentPage: null,
    isMsgPage: function() {
        if ($(SELECTOR.connect.isMsg).length > 0) {
            return true;
        } else {
            return false;
        }
    },
    isCompany: function() {
        if ($(SELECTOR.company.isCom).length > 0) {
            return true;
        } else {
            return false;
        }
    },
    isActivity: function() {
        if ($(SELECTOR.activity.isActivity).length > 0 || $(SELECTOR.activity.feed).length > 0) {
            return true;
        } else {
            return false;
        }
    },
    init: function() {
        setTimeout(function() {
            if ($(SELECTOR.profileCard).length > 0 || LINKEDIN.isCompany() || LINKEDIN.isActivity() || LINKEDIN.isMsgPage()) {
                var Interval = setInterval(function() {
                    if (LINKEDIN.currentPage != window.location.href && $(SELECTOR.profileCard).length > 0 || LINKEDIN.isCompany() || LINKEDIN.isActivity() || LINKEDIN.isMsgPage()) {
                        LINKEDIN.currentPage = window.location.href;
                        if(LINKEDIN.isMsgPage()) {
                            LINKEDIN.invokeSendMessagePerson();
                            clearInterval(Interval);
                        } else if (LINKEDIN.isCompany()) {
                            SELECTOR.profileCard = ".org-top-card-module.org-top-card-module--non-lcp-page.ember-view";
                            if ($(SELECTOR.profileCard).length < 1) {
                                SELECTOR.profileCard = ".org-top-card-module.org-top-card-module--lcp-page.ember-view";
                            }
                            // $(".org-top-card-module.org-top-card-module--lcp-page.ember-view")
                            SELECTOR.bizform = ".bizform-company";
                            SELECTOR.personDetails = ".org-company-employees-snackbar.company-employees-snackbar.ember-view"
                            LINKEDIN.appendCompanyBtn();
                            LINKEDIN.appendCompanyTypeahead();
                            LINKEDIN.bindActions();
                            clearInterval(Interval);
                        } else if (LINKEDIN.isActivity()) {
                            LINKEDIN.appendActivity();
                            clearInterval(Interval);
                            LINKEDIN.addScrollEvent();
                        } else {
                            LINKEDIN.appendButtons(select(SELECTOR.profileCard)[0]);
                            LINKEDIN.appendTypehead();
                            LINKEDIN.appendCompanyTypeahead();
                            LINKEDIN.sendConnectMsg();
                            LINKEDIN.sendMessagePerson();
                            clearInterval(Interval);
                        }
                    }
                }, 500);
            } else {
                LINKEDIN.init();
            }
        }, 1000);
    },
    personId: "",
    companyId: "",
    tempUserObj: {},
    tempComObj: {},
    invokeConnectMsg : function() {
        $(SELECTOR.connect.btn).trigger('click');
        $(SELECTOR.connect.addnote).trigger('click');
        $(SELECTOR.connect.textarea).val(SELECTOR.connect.msg);
        $(SELECTOR.connect.sendInvite).trigger('click');
        $(this).hide();
    },
    sendConnectMsg : function() {
        if ($(SELECTOR.connect.btn).length > 0) {
            $(SELECTOR.connect.btn).hide();
            var btn = '<button class="primary top-card-action btn-connect-msg" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Connect/Msg</span></button>';
            $(SELECTOR.connect.btn).after(btn);
            $(document).on('click', '.btn-connect-msg', LINKEDIN.invokeConnectMsg);
        }
    },
    addPopupCreateMsgForm : function(selfBtn, textView) {
        console.log('Create Message');
        $('#floatingform-message-create').remove();
        var floatingForm = '<div id="floatingform-message-create" style="position:fixed; min-width:320px; z-index:9999; top:30%; left:35%;">'
        + '<ul style="list-style:none; padding:20px; background-color:white; box-shadow: 0px 0px 5px 0px #283e4a;">'
            + '<li class="first-name">'
                    + '<label for="floatform-name">Name:</label>'
                    + '<div class="fieldgroup">'
                      + '<span class="error" id="floatform-name-error"></span>'
                      + '<input type="text" name="name" value="" id="floatform-name">'
                    + '</div>'
                  + '</li>'
            + '<li class="last-name">'
                    + '<label for="floatform-company">Company:</label>'
                    + '<div class="fieldgroup">'
                      + '<span class="error" id="floatform-company-error"></span>'
                      + '<input type="text" name="company" value="" id="floatform-company">'
                    + '</div>'
            + '</li>'
            + '<li class="last-name">'
                    + '<label for="floatform-country">Country:</label>'
                    + '<div class="fieldgroup">'
                      + '<span class="error" id="floatform-country-error"></span>'
                      + '<input type="text" name="company" value="" id="floatform-country">'
                    + '</div>'
            + '</li>'
            + '<li>'
            + '<button class="primary top-card-action floatform-btn-set-message-create-920" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px; width: 40%;"><span class="default-text">OK</span></button>'
            + '<button class="primary top-card-action floatform-btn-set-message-cancel-920" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px; width: 40%; margin-left:15px;"><span class="default-text">CANCEL</span></button>'
            + '</li>'
            + '<li>'
            + '<textarea id="floatform-set-message-textarea-920"></textarea>'
            + '</li>'
        + '</ul></div>';
        
        $('body').append(floatingForm);
        $('.floatform-btn-set-message-create-920').unbind('click');
        $(document).on('click', '.floatform-btn-set-message-create-920', function(){
            var msg = $('#floatform-set-message-textarea-920').val();
            if(msg !== undefined) {
                var name = $('#floatform-name').val();
                var comp = $('#floatform-company').val();
                var country = $('#floatform-country').val();
                msg = msg.replace('%name%', name);
                msg = msg.replace('%company%', comp);
                msg = msg.replace('%country%', country);
                if($(textView).length > 0) {
                    $(textView).val(msg);
                } else {
                    $(selfBtn).parent().find(textView).val(msg);
                }
                LINKEDIN.sendMsgSaveReq(msg);
                // $(selfBtn).parent().find(textView).text(msg);
                console.log(msg);
                $('#floatingform-message-create').remove();
            }
        });
        $('.floatform-btn-set-message-cancel-920').unbind('click');
        $(document).on('click', '.floatform-btn-set-message-cancel-920', function(){
            $('#floatingform-message-create').remove();
        });
        
    },
    sendMsgSaveReq : function(msg) {
        // var imgurl = $(self).parent().find('.msg-entity-lockup.truncate.pv0.ph3.EntityLockup-circle-2.ember-view img').attr('src');
        // var name = $(self).parent().find('.msg-entity-lockup__entity-info-row').text().trim();
        // var headline = $(self).parent().find('.msg-entity-lockup__entity-info.truncate').text().trim();
        // var query = {};
        console.log(LINKEDIN.tempUserObj);
        if(LINKEDIN.tempUserObj._id !== undefined) {
            service.saveMsg({
                'createdBy' : createdBy['createdBy'],
                detail : msg,
                person : LINKEDIN.tempUserObj._id
            }, function(r) {
                console.log(r);
                if(r !== undefined) {
                    LINKEDIN.showMessages("Message saved success", "succeess");
                } else {
                    LINKEDIN.showMessages("Unable to save message please try again later", "error");    
                }
            })
        } else {
            LINKEDIN.showMessages("Unable to save message user not avaiable", "error");
        }
        
    },
    appendFixedMsgBtn : function() {
        var btnFix =   '<button class="primary top-card-action btn-message-create-120" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Create Message</span></button>';
        $(SELECTOR.connect.msgListShowPanel).parent().find('.btn-message-create-120').remove();
        $(SELECTOR.connect.msgListShowPanel).after(btnFix);
        $('.btn-message-create-120').unbind('click');
        $(document).on('click', '.btn-message-create-120', function(){
            LINKEDIN.addPopupCreateMsgForm($(this), SELECTOR.connect.msgTextArea);
        });
    },
    appendFixedMsgBtn2 : function() {
        $(SELECTOR.connect.msgPageCompose).parent().find('.btn-message-create-220').remove();
        var btnFix =   '<button class="primary top-card-action btn-message-create-220" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Create Message</span></button>';
        $(SELECTOR.connect.msgPageCompose).before(btnFix);
        $('.btn-message-create-220').unbind('click');
        $(document).on('click', '.btn-message-create-220', function(){
            LINKEDIN.addPopupCreateMsgForm($(this), $(SELECTOR.connect.msgTextArea2).find(SELECTOR.connect.msgTextArea2sub));
        });
    },
    invokeSendMessagePerson : function() {
        $(SELECTOR.connect.msgBtn).trigger('click');
        if($(SELECTOR.connect.msgBoxFix).length > 0) {
            LINKEDIN.appendFixedMsgBtn();
        } else if (LINKEDIN.isMsgPage()) {
            // LINKEDIN.appendFixedMsgBtn2();
            LINKEDIN.addMsgComposeBtn();
        }
    },
    addMsgComposeBtn : function() {
        $('.btn-compose-message-create-1320').remove();
        var aTag = '<button class="primary top-card-action btn-compose-message-create-1320" style="margin:13px; width: 90%; background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Create Message</span></button>';
                   
        $(SELECTOR.connect.beforeMsgPaneTitle).after(aTag);
        $('.btn-compose-message-create-1320').unbind('click');
        $(document).on('click', '.btn-compose-message-create-1320', function() {
            console.log();
            LINKEDIN.addPopupCreateMsgForm($(this), $(SELECTOR.connect.msgTextArea2).find(SELECTOR.connect.msgTextArea2sub));
        });
    },
    sendMessagePerson : function() {
        if ($(SELECTOR.connect.msgBtn).length > 0) {
            $(SELECTOR.connect.msgBtn).hide();
            var btn = '<button class="primary top-card-action btn-message-person-720" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Send Message</span></button>';
            $(SELECTOR.connect.msgBtn).after(btn);
            $('.btn-message-person-720').unbind('click');
            $(document).on('click', '.btn-message-person-720', LINKEDIN.invokeSendMessagePerson);
        }
    },
    paste : function() {
        var result = '';
        $('body').append('<span id="paste-the-source-content"></span>');
        var sandbox = $('.paste-the-source-content').val('').select();
        if (document.execCommand('paste')) {
            result = sandbox.val();
        }
        chrome.runtime.sendMessage(
            "dlnjpkndgdgmpcdcfmceofiiaelclpdk", { method: 'getClipboard' },
            function(response) {
                console.log(response);
                document.getElementById('paste-the-source-content').textContent = response;
                $('.paste-the-source-content').remove();
            }
        );
        return result;
    },
    sendRequestActivity: function(self, callback) {
        $(self).closest('article').find('.control-panel-trigger').trigger('click');
        $(self).closest('article').find('button[data-control-name=control_menu_copy_link]').trigger('click');
        chrome.runtime.sendMessage(
            extensionId, { method: 'getClipboard' },
            function(res) {
                callback(self, res);
            });
    },
    getActivityInfo: function(elm, response) {
        var activity = {
            'createdBy' : createdBy['createdBy'],
            details: $(elm).parent().parent().find('.feed-s-update__description .feed-s-main-content').text().trim(),
            status: {
                dataId: $(elm).closest('article').attr('data-id')
            },
            source: "LINKEDIN",
            sourceUrl: response
        };
        var comp = $(elm).parent().parent().find('.crm-company-id').text().trim();
        var person = $(elm).parent().parent().find('.crm-person-id').text().trim();
        if (comp !== undefined && comp !== "") {
            activity['company'] = comp;

        } else if (person !== undefined && person !== "") {
            activity['person'] = person;
        }
        return activity;
    },
    isPersonQuery: function(username, key) {
        service.queryPerson({
            "lk.username": username
        }, function(r) {
            console.log(r);
            $(key).parent().parent().find('h5.msg-crm-status').remove();
            $(key).parent().parent().find('h5.crm-person-id').remove();
            $(key).parent().parent().find('h5.crm-company-id').remove();
            if (r !== undefined && r.length !== undefined && r.length > 0) {
                console.log("exist :  " + username);
                if (r[0].companies !== undefined && r[0].companies.length > 0) {
                    $(key).parent().parent().find('.feed-s-post-meta__name').after('<h5 class="crm-company-id" style="display:none;">' + r[0].companies[0] + '</h5>');
                }
                $(key).parent().parent().find('.feed-s-post-meta__name').after('<h5 class="crm-person-id" style="display:none;">' + r[0]._id + '</h5>');
                $(key).parent().parent().find('.feed-s-post-meta__name').after('<h5 class="msg-crm-status" style="color:green;">EXIST IN CRM</h5>');
            } else {
                $(key).parent().parent().find('.feed-s-post-meta__name').after('<h5 class="msg-crm-status" style="color:red;">NOT EXIST IN CRM</h5>');
            }
        });
    },
    appendSaveActivityBtn: function() {
        var a = $(SELECTOR.activity.activity);
        for (var x = 0; x < a.length; x++) {
            if ($(a[x]).closest('.feed-s-mini-update').length < 1 && $(a[x]).find('.activity-crm-save-btn').length < 1) {
                if ($(a[x]).parent().find('.activity-crm-status').length < 1 && $(a[x]).parent().find('.activity-crm-save-btn').length < 1) {
                    var abc = $(a[x]).parent().find('.feed-s-post-meta__profile-link').attr('href').split('/');
                    LINKEDIN.isPersonQuery(abc[abc.length - 1 - 1].trim(), a[x]);
                    LINKEDIN.checkActivityExist(a[x]);
                }
            }
        }
    },
    checkActivityExist: function(curr) {
        service.queryInfo({
            "status.dataId": $(curr).closest('article').attr('data-id')
        }, function(r) {
            if (r !== undefined && r.length > 0) {
                $(curr).parent().find('.activity-crm-status').remove();
                $(curr).after('<div class="feed-s-post-meta ember-view"><h5 class="activity-crm-status" style="color:green;">Already In CRM</h5></div>');
            } else {
                $(curr).parent().find('.activity-crm-save-btn').remove();
                $(curr).after('<div class="feed-s-post-meta ember-view"><button class="button-primary-medium activity-crm-save-btn">Save Activity</button></div>');
            }
        });
    },
    addScrollEvent: function() {
        var a = $(SELECTOR.activity.activity);
        $(window).scroll(function() {
            if ($(SELECTOR.activity.activity).length > a.length) {
                a = $(SELECTOR.activity.activity);
                LINKEDIN.appendSaveActivityBtn();
            }
        });
    },
    sendAvtivitySaveRequest: function(self, response) {
        service.saveInfo(LINKEDIN.getActivityInfo(self, response), function(r) {
            console.log("Save Info");
            console.log(r);
            if (r !== undefined && r._id !== undefined) {
                var parent = $(self).parent();
                $(self).remove();
                $(parent).append('<h5 class="activity-crm-status" style="color:green;">Added In CRM</h5>');
                LINKEDIN.showMessages("Activity Saved", "succeess");
            } else {
                LINKEDIN.showMessages("Unable To Save Please Try Again later", "error");
            }
        });
    },
    appendActivity: function() {
        console.log('hello activity-crm-save-btn');
        LINKEDIN.appendSaveActivityBtn();
        $(document).on('click', ".activity-crm-save-btn", function() {
            console.log('clicked the save Activity btn');
            var self = $(this);
            LINKEDIN.sendRequestActivity(self, LINKEDIN.sendAvtivitySaveRequest);
        });
    },
    showPersonList: function(r, elm) {
        console.log(r);
        $(".typeahead-list-panel").empty("");
        if (r.length > 0) {
            var list = '<ol style="margin-left: 20px; border: 1px solid black;">'
            for (var z = 0; z < r.length; z++) {
                list += '<li style="border: 1px solid black; padding: 10px; text-align: left;" id="' + r[z]._id + '">' + r[z]._id + '&nbsp;&nbsp;&nbsp;&nbsp;' + ((LINKEDIN.isCompany()) ? r[z].title : r[z].name) + '&nbsp;&nbsp;&nbsp;&nbsp;' + ((LINKEDIN.isCompany()) ? ((r[z].type !== undefined) ? r[z].type : r[z].status) : ((r[z].address !== undefined) ? r[z].address.raw : r[z].email)) + "</li>";
                $(document).on("click", "#" + r[z]._id + "", function() {
                    LINKEDIN.personId = $(this).attr('id');
                    console.log(LINKEDIN.personId);
                    if (elm !== undefined) {
                        $(elm).val("");
                    }
                    $(".typeahead-list-panel").empty("");
                });
            } + "</ol>";
            $(".typeahead-list-panel").append(list);
        } else {
            $(".typeahead-list-panel").empty("");
        }
    },
    showPersonList1: function(r, elm) {
        console.log(r);
        $(".typeahead-list-panel-1").empty("");
        if (r.length > 0) {
            var list = '<ol style="margin-left: 20px; border: 1px solid black;">'
            for (var z = 0; z < r.length; z++) {
                list += '<li style="border: 1px solid black; padding: 10px; text-align: left;" id="' + r[z]._id + '">' + r[z]._id + '&nbsp;&nbsp;&nbsp;&nbsp;' + r[z].title + '&nbsp;&nbsp;&nbsp;&nbsp;' + ((r[z].type !== undefined) ? r[z].type : r[z].status) + "</li>";
                $(document).on("click", "#" + r[z]._id + "", function() {
                    LINKEDIN.companyId = $(this).attr('id');
                    console.log(LINKEDIN.companyId);
                    LINKEDIN.tempUserObj = LINKEDIN.getInfo();
                    if (elm !== undefined) {
                        $(elm).val("");
                    }
                    $('.appendCompanyTypeahead').show();
                    $(".typeahead-list-panel-1").empty("");
                });
            } + "</ol>";
            $(".typeahead-list-panel-1").append(list);
        } else {
            $(".typeahead-list-panel-1").empty("");
        }
    },
    appendCompanyTypeahead: function() {
        $(".ally-typeahead1234-panel").remove();
        var element = '<div class="pv-top-card-section__information mt3 ally-typeahead1234-panel">'

        +'<div class="type-ahead-input-wrapper">' + '<div class="type-ahead-input">' + '  <label for="ally-typeahead1234" class="visually-hidden">' + '      Search' + '  </label>' + '  <input aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="Search" autocorrect="off" autocapitalize="off" id="ally-typeahead1234" role="combobox" class="ember-text-field typeahead" aria-expanded="false"></input>' + '<button action="saveForm2" class="primary top-card-action appendCompanyTypeahead" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Save</span></button>' + '  <div class="type-ahead-input-icons">' + '  </div>' + '</div>' + '</div>' + '<div class="typeahead-list-panel-1"></div>' + '</div>';

        $(".pv-top-card-section__actions.mt4").after(element);
        $(".ally-typeahead1234-panel").hide();
        $('.appendCompanyTypeahead').hide();
        $("#ally-typeahead1234").keyup(function() {
            if ($("#ally-typeahead1234").val() !== "" && $("#ally-typeahead1234").val() !== undefined) {
                var key = "";
                var query = {};
                var queryCon = {
                    '$regex': $("#ally-typeahead1234").val()
                };
                key = service.companyKey;
                query['title'] = queryCon;
                service.query(key, query, function(r) {
                    $('.appendCompanyTypeahead').show();
                    LINKEDIN.showPersonList1(r, "#ally-typeahead1234");
                });
            } else {
                $(".typeahead-list-panel-1").empty("");
            }
        });
    },
    appendTypehead: function() {
        console.log("hello typehead");
        $(".ally-typeahead123-panel").remove();
        var element = '<div class="pv-top-card-section__information mt3 ally-typeahead123-panel">' + '<div class="type-ahead-input-wrapper">' + '<div class="type-ahead-input">' + '  <label for="ally-typeahead123" class="visually-hidden">' + '      Search' + '  </label>' + '  <input aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="Search" autocorrect="off" autocapitalize="off" id="ally-typeahead123" role="combobox" class="ember-text-field typeahead" aria-expanded="false"></input>' + '  <div class="type-ahead-input-icons">' + '  </div>' + '</div>' + '</div>' + '<div class="typeahead-list-panel"></div>' + '</div>';

        $(SELECTOR.personDetails).after(element);
        $(".ally-typeahead123-panel").hide();
        typeahead.create("#ally-typeahead123", function(elm) {
            if ($(elm).val() !== "" && $(elm).val() !== undefined) {
                var key = "";
                var query = {};
                var queryCon = {
                    '$regex': $(elm).val()
                };
                if (LINKEDIN.isCompany()) {
                    key = service.companyKey;
                    query['title'] = queryCon;
                } else {
                    key = service.personKey;
                    query['name'] = queryCon;
                }
                service.query(key, query, function(r) {
                    LINKEDIN.showPersonList(r, elm);
                });
            } else {
                $(".typeahead-list-panel").empty("");
            }
        });
    },
    appendCompanyBtn: function() {
        console.log("Append COMPANY UI");
        var actionBar = $(SELECTOR.company.actionBar);
        $("#copyUserInfo").remove();
        $("body").append('<input style="opacity:0;" type="text" id="copyUserInfo">');
        var addBtn = "";
        for (var a = 0; a < actions.length; a++) {
            addBtn += '<button action="' + actions[a] + '" class="org-top-card-actions__follow-btn mr1 button-primary-medium org-hover-button ember-view remove-company-btn">  <span class="org-hover-button__hover-label">' + actions[a] + '</span>' + '<span aria-hidden="true" class="org-hover-button__normal-label">' + actions[a] + '</span>' + '</button>';
        }
        var form = '<ul class="bizform-company" style="list-style:none;">'

        +'<li><div class="fieldgroup"><label>Title</label><input type="text" name="title"></div></li>' + '<li><div class="fieldgroup"><label>Logo</label><input type="text" name="logo"></div></li>' + '<li><div class="fieldgroup"><label>About</label><input type="text" name="about"></div></li>'

        + '<li><div class="fieldgroup"><label>State</label><input type="text" name="specailites"></div></li>' + '<li><div class="fieldgroup"><label>Country</label><input type="text" name="type"></div></li>'

        + '<li><div class="fieldgroup"><label>Image URL</label><input type="text" name="size"></div></li>' + '<li><div class="fieldgroup"><label>Company</label><input type="text" name="website"></div></li>' + '<li><div class="fieldgroup"><label>Education</label><input type="text" name="founded"></div></li>' + '<li><div class="fieldgroup"><label>Education</label><input type="text" name="lk.url"></div></li>'

        + '<li><div class="fieldgroup"><label>State</label><input type="text" name="address.state"></div></li>' + '<li><div class="fieldgroup"><label>Country</label><input type="text" name="address.country"></div></li>'

        + '<li><button class="primary top-card-action" action="closeForm" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Close</span></button></li>' + '<li><button action="saveForm" class="primary top-card-action" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Save</span></button></li>' + '</ul>';
        $(actionBar).append(addBtn);
        $('.org-top-card-module__company-actions-bar').after(form);
        $('.bizform-company').hide();

        service.queryCompany({
            "lk.url": window.location.href
        }, function(r) {
            if (r.length === 1) {
                $(SELECTOR.company.title).after('<h4 style="color:green;">EXIST IN CRM</h4>');
                $('button[action=Save]').hide();
                LINKEDIN.personId = r[0]._id;
                $(".ally-typeahead123-panel").show();
                $(".ally-typeahead1234-panel").show();
            } else if (r.length > 1) {
                $(".ally-typeahead123-panel").show();
                $(".ally-typeahead1234-panel").show();
                LINKEDIN.showPersonList(r);
            } else {
                service.queryCompany({
                    "title": $(SELECTOR.company.title).text().trim(),
                }, function(r) {
                    if (r.length === 1) {
                        $(SELECTOR.company.title).after('<h4 style="color:green;">EXIST IN CRM</h4>');
                        $('button[action=Save]').hide();
                        LINKEDIN.personId = r[0]._id;
                        $(".ally-typeahead123-panel").show();
                        $(".ally-typeahead1234-panel").show();
                    } else if (r.length > 1) {
                        $(".ally-typeahead123-panel").show();
                        $(".ally-typeahead1234-panel").show();
                        LINKEDIN.showPersonList(r);
                    }
                });
            }
        });
    },
    updatePersonIfExist: function(data) {
        var sendData = {};
        sendData[service.personKey] = data;
        if ($(SELECTOR.connect.btn).length > 0) {
            data['lk']['status'] = "NOT CONNECTED";
        } else if ($(SELECTOR.connect.isPending).length > 0) {
            data['lk']['status'] = "PENDING";
        } else if ($(SELECTOR.connect.isConnect).length > 0) {
            data['lk']['status'] = "CONNECTED";
        } else {
            data['lk']['status'] = "NOT CONNECTED";
        }
        var id = data._id;
        delete data._id;
        service.update(service.personKey + "/" + id, sendData, function(r) {
            console.log(r);
            if(r !== undefined){
                LINKEDIN.tempUserObj = r;
            }
            // LINKEDIN.showMessages("Person Update Complete");
        });
    },
    showMessages: function(msg, type) {
        $('#showMessages-crm-plugin').remove();
        var col = "#3f51b5";
        if (type === "success") {
            col = "#4caf50";
        } else if (type === "error") {
            col = "#a11";
        } else if (type === "warn") {
            col = "#ff9800";
        }
        $('body').append('<div style="position:fixed; bottom:50px; left:45%; background-color:' + col + '; min-width:200px; color:white; text-align:center; padding : 10px; z-index: 9999999;" id="showMessages-crm-plugin">' + msg + '</div>')
        setTimeout(function() {
            $('#showMessages-crm-plugin').remove();
        }, 3000);
    },
    appendButtons: function(profileCard) {
        var actionsBox = select(SELECTOR.actionsBox, profileCard)[0];
        if ($(actionsBox).length < 1) {
            return '';
        }
        console.log("Append UI");
        $("#copyUserInfo").remove();
        $("body").append('<input style="opacity:0;" type="text" id="copyUserInfo">');
        var form = '<ul class="bizform" style="list-style:none;">'

        +'<li><div class="fieldgroup"><label>First Name</label><input type="text" name="firstname"></div></li>' + '<li><div class="fieldgroup"><label>Last Name</label><input type="text" name="lastname"></div></li>' + '<li><div class="fieldgroup"><label>Full Name</label><input type="text" name="name"></div></li>'

        + '<li><div class="fieldgroup"><label>State</label><input type="text" name="address.state"></div></li>' + '<li><div class="fieldgroup"><label>Country</label><input type="text" name="address.country"></div></li>'

        + '<li><div class="fieldgroup"><label>Image URL</label><input type="text" name="lk.imgurl"></div></li>' + '<li><div class="fieldgroup"><label>Company</label><input type="text" name="lk.company"></div></li>' + '<li><div class="fieldgroup"><label>Education</label><input type="text" name="lk.school"></div></li>' + '<li><div class="fieldgroup"><label>Headline</label><input type="text" name="lk.headline"></div></li>'

        + '<li><button class="primary top-card-action" action="closeForm" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Close</span></button></li>' + '<li><button action="saveForm" class="primary top-card-action" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Save</span></button></li>' + '</ul>';
        $(profileCard).find("button[action]").remove();
        $(SELECTOR.bizform).remove();
        $(SELECTOR.section__body).append(form);
        $(SELECTOR.bizform).hide();
        var path = "person/" + LINKEDIN.getUsername();
        service.queryPerson({
            "lk.url": window.location.href
        }, function(r) {
            if (r !== undefined && r.length === 1) {
                var view = '<button style="margin:8px;" class="primary top-card-action" action="getFromServer"><span class="default-text">Already Exist</span></button>';
                view = view + '<button style="margin:8px;" class="primary top-card-action" action="' + actions[1] + '"><span class="default-text">' + actions[1] + '</span></button>';
                $(actionsBox).append(view);
                LINKEDIN.bindActions(r[0]);
                LINKEDIN.personId = r[0]._id;
                LINKEDIN.tempUserObj = r[0];
                LINKEDIN.updatePersonIfExist(r[0]);
                $(".ally-typeahead123-panel").show();
                $(".ally-typeahead1234-panel").show();
            } else if (r !== undefined && r.length > 1) {
                for (var i = 0; i < actions.length; i++) {
                    var actn = actions[i];
                    view = '<button style="margin:8px;" class="primary top-card-action" action="' + actn + '"><span class="default-text">' + actn + '</span></button>';
                    $(actionsBox).append(view);
                }
                LINKEDIN.bindActions();
                $(".ally-typeahead123-panel").show();
                $(".ally-typeahead1234-panel").show();
                LINKEDIN.showPersonList(r);
            } else {
                var location = select(SELECTOR.location, profileCard)[0].textContent.trim();
                var add1 = {};
                if (location.indexOf(",") > -1) {
                    location = location.split(",");
                    add1["country"] = location.pop().trim();
                } else {
                    add1["country"] = location.trim();
                }
                service.queryPerson({
                    "name": select(SELECTOR.name, profileCard)[0].textContent.trim(),
                    "address.country": add1
                }, function(r) {
                    if (r !== undefined && r.length === 1) {
                        var view = '<button style="margin:8px;" class="primary top-card-action" action="getFromServer"><span class="default-text">Already Exist</span></button>';
                        view = view + '<button style="margin:8px;" class="primary top-card-action" action="' + actions[1] + '"><span class="default-text">' + actions[1] + '</span></button>';
                        $(actionsBox).append(view);
                        LINKEDIN.bindActions(r[0]);
                        LINKEDIN.personId = r[0]._id;
                        LINKEDIN.tempUserObj = r[0];
                        LINKEDIN.updatePersonIfExist(r[0]);
                        $(".ally-typeahead123-panel").show();
                        $(".ally-typeahead1234-panel").show();
                    } else if (r !== undefined && r.length > 1) {
                        for (var i = 0; i < actions.length; i++) {
                            var actn = actions[i];
                            view = '<button style="margin:8px;" class="primary top-card-action" action="' + actn + '"><span class="default-text">' + actn + '</span></button>';
                            $(actionsBox).append(view);
                        }
                        LINKEDIN.bindActions();
                        $(".ally-typeahead123-panel").show();
                        $(".ally-typeahead1234-panel").show();
                        LINKEDIN.showPersonList(r);
                    } else {
                        for (var i = 0; i < actions.length; i++) {
                            var actn = actions[i];
                            view = '<button style="margin:8px;" class="primary top-card-action" action="' + actn + '"><span class="default-text">' + actn + '</span></button>';
                            $(actionsBox).append(view);
                        }
                        LINKEDIN.bindActions();
                        LINKEDIN.personId = "";
                        $(".ally-typeahead123-panel").hide();
                        $(".ally-typeahead1234-panel").hide();
                    }
                });
            }
        });
    },
    copyUserInfo: function(a) {
        var USER = LINKEDIN.getInfo();
        $('#copyUserInfo').val(JSON.stringify(USER));
        $('#copyUserInfo').select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    },
    bindActions: function(uu) {
        $(SELECTOR.profileCard).find("button[action]").on("click", function() {
            var t = $(this).attr("action");
            switch (t) {
                case actions[0]:
                    LINKEDIN.editUser();
                    $(SELECTOR.bizform).show();
                    break;
                case actions[1]:
                    LINKEDIN.editUser();
                    break;
                case actions[2]:
                    var key = ((LINKEDIN.isCompany()) ? service.companyKey : service.personKey);
                    var sendData = {};
                    sendData[key] = LINKEDIN.getInfo();
                    service.save(key, sendData, function(r) {
                        console.log(r);
                        LINKEDIN.statusPerson(r);
                    });
                    break;
                case "getFromServer":
                    LINKEDIN.editUser(uu);
                    $(SELECTOR.bizform).show();
                    break;
                case "closeForm":
                    LINKEDIN.tempUserObj = {};
                    $(SELECTOR.bizform).hide();
                    break;
                case "saveForm":
                    LINKEDIN.saveUser();
                    break;
                case "saveForm2":
                    LINKEDIN.saveUser2();
                    break;
            }
        });
    },
    statusPerson: function(res) {
        if (res.statusText !== undefined && res.statusText === "error") {
            LINKEDIN.showMessages("Error unable to save please try again later.", 'error');
        } else {
            if (LINKEDIN.isCompany()) {
                $('.remove-company-btn').remove();
                LINKEDIN.appendCompanyBtn();
                LINKEDIN.showMessages("Company Added Successfully", "success");
            } else {
                LINKEDIN.appendButtons(select(SELECTOR.profileCard)[0]);
                LINKEDIN.showMessages("Person Added Successfully", "success");
            }
        }
    },
    onChangeInput: function(output, key, input) {
        if (key.indexOf(".") > -1) {
            key = key.split(".");
            var a = output;
            for (var x = 0; x < key.length - 1; x++) {
                a = a[key[x]];
            }
            a[key[key.length - 1]] = input;
        } else {
            output[key] = input;
        }
    },
    saveUser: function() {
        var inputs = $(SELECTOR.bizform).find("input[name]");
        var USER = LINKEDIN.tempUserObj;
        for (var i = 0; i < inputs.length; i++) {
            LINKEDIN.onChangeInput(USER, $(inputs[i]).attr("name"), $(inputs[i]).val());
        }
        var key = ((LINKEDIN.isCompany()) ? service.companyKey : service.personKey);
        var sendData = {};
        sendData[key] = USER;
        if (USER._id !== undefined) {
            var id = USER._id;
            delete USER._id;
            service.update(key + "/" + id, sendData, function(r) {
                console.log(r);
                LINKEDIN.statusPerson(r);
                $(SELECTOR.bizform).hide();
            });
        } else {
            service.save(key, sendData, function(r) {
                console.log(r);
                LINKEDIN.statusPerson(r);
                $(SELECTOR.bizform).hide();
            });
        }
    },
    saveUser2: function() {
        var inputs = $(SELECTOR.bizform).find("input[name]");
        var USER = LINKEDIN.tempUserObj;
        var key = ((LINKEDIN.isCompany()) ? service.companyKey : service.personKey);
        var sendData = {};
        sendData[key] = USER;
        if (USER._id !== undefined) {
            var id = USER._id;
            delete USER._id;
            service.update("person" + "/" + id, sendData, function(r) {
                console.log(r);
                LINKEDIN.statusPerson(r);
                $(SELECTOR.bizform).hide();
            });
        } else {
            service.save(key, sendData, function(r) {
                console.log(r);
                LINKEDIN.statusPerson(r);
                $(SELECTOR.bizform).hide();
            });
        }
    },
    editUser: function(uu) {
        uu = uu ? uu : LINKEDIN.getInfo();
        var inputs = $(SELECTOR.bizform).find("input[name]");
        for (var i = 0; i < inputs.length; i++) {
            $(inputs[i]).change(function() {
                console.log($(this).val());
            });
            var v, key = $(inputs[i]).attr("name");
            if (key.indexOf(".") > -1) {
                key = key.split(".");
                v = uu;
                for (var x = 0; x < key.length; x++) {
                    if (v[key[x]] !== undefined)
                        v = v[key[x]];
                }
            } else {
                v = uu[$(inputs[i]).attr("name")];
            }
            if (v !== undefined) {
                $(inputs[i]).val(v);
            }
        }
        LINKEDIN.copyUserInfo();
    },
    getInfo: function() {
        LINKEDIN.tempUserObj = {};
        var href = window.location.href,
            USER = {};
        if (LINKEDIN.isCompany()) {
            USER = {
                'createdBy' : createdBy['createdBy'],
                'title': $(SELECTOR.company.title).text().trim(),
                'website': $(SELECTOR.company.website).attr('href'),
                lk: {
                    url: href,
                    logo: $(SELECTOR.company.logo).attr('src'),
                    about: $(SELECTOR.company.about).text(),
                    specailites: $(SELECTOR.company.specailites).text().trim(),
                    founded: $(SELECTOR.company.founded).text().trim(),
                    size: $(SELECTOR.company.size).text().trim(),
                    type: $(SELECTOR.company.industry).text().trim(),
                }
            };
            if (USER.lk.type !== "") {
                USER['category'] = [];
                USER['category'].push(USER.lk.type);
            }
            if (USER.lk.specailites !== "") {
                USER['tags'] = [];
                if (USER.lk.specailites.indexOf(',') > -1) {
                    var spec = USER.lk.specailites.split(',');
                    for (var c = 0; c < spec.length; c++) {
                        USER['tags'].push(spec[c]);
                    }
                } else {
                    USER['tags'].push(USER.lk.specailites);
                }
            }
            var location = $(SELECTOR.company.hq).text().trim();
            if (location !== undefined && location !== "") {
                var add1 = {};
                add1["raw"] = location;
                if (location.indexOf(",") > -1) {
                    location = location.split(",");
                    add1["country"] = location.pop().trim();
                    if (location.length > 1) {
                        add1["state"] = location.pop().trim();
                        add1["city"] = location.join(",");
                    } else {
                        add1["state"] = location.pop().trim();
                    }
                } else {
                    add1["country"] = location.trim();
                }
                USER['address'] = [];
                USER['address'].push(add1);
            }
        } else {
            var profileCard = select(SELECTOR.profileCard)[0];
            if (href.match(profileURL)) {
                var name = select(SELECTOR.name, profileCard)[0].textContent.trim();
                var firstName, lastName, name;
                if (name.indexOf(" ") > -1) {
                    name = name.split(" ");
                    firstName = name[0];
                    lastName = name.slice(1, name.length).join(" ");
                } else {
                    firstName = name;
                    lastName = "";
                }
                var location = select(SELECTOR.location, profileCard)[0].textContent.trim();
                var add1 = {};
                add1["raw"] = location;
                if (location.indexOf(",") > -1) {
                    location = location.split(",");
                    add1["country"] = location.pop().trim();
                    if (location.length > 1) {
                        add1["state"] = location.pop().trim();
                        add1["city"] = location.join(",");
                    } else {
                        add1["state"] = location.pop().trim();
                    }
                } else {
                    add1["country"] = location.trim();
                }
                USER = {
                    name: select(SELECTOR.name, profileCard)[0].textContent.trim(),
                    firstname: firstName,
                    lastname: lastName,
                    address: add1,
                    'createdBy' : createdBy['createdBy'],
                    lk: {
                        url: href,
                        username: LINKEDIN.getUsername(),
                        imgurl: $(SELECTOR.img).attr('src'),
                        headline: $(SELECTOR.headline).text().trim(),
                        company: $(SELECTOR.company1).text().trim(),
                        school: $(SELECTOR.school).text().trim(),
                    },
                }
                if (LINKEDIN.companyId !== undefined && LINKEDIN.companyId !== "") {
                    USER["companies"] = [];
                    USER["companies"].push(LINKEDIN.companyId);
                }
            }
        }
        if (LINKEDIN.personId !== undefined && LINKEDIN.personId !== "") {
            USER["_id"] = LINKEDIN.personId;
        }
        LINKEDIN.tempUserObj = USER;
        return USER;
    },
    getUsername: function() {
        var href = window.location.href;
        var w = href.replace(profileURL, "");
        w = w.split("/");
        w = w[0];
        return w;
    }
};
window.select = function(query, elm) {
    var elm = elm != '' && elm != undefined ? elm : document;
    return elm.querySelectorAll(query);
}
window.addEventListener("load", LINKEDIN.init, false);
var currentUrl = window.location.href;
var locationinterval = setInterval(function() {
    // console.log('interval running');
    if(currentUrl !== window.location.href) {
        currentUrl = window.location.href;
        if(LINKEDIN.isMsgPage()){
            LINKEDIN.init();
        }
    }
}, 1000);
