var profileURL = "https://www.linkedin.com/in/";
var SELECTOR = {
    profileCard: ".profile-view-grid .pv-top-card-section",
    img: ".pv-top-card-section__image",
    name: ".pv-top-card-section__name",
    headline: ".pv-top-card-section__headline",
    company: ".pv-top-card-section__company",
    school: ".pv-top-card-section__school",
    location: ".pv-top-card-section__location",
    actionsBox: ".pv-top-card-section__actions",
    section__body: ".pv-top-card-section__body",
    section__information: ".pv-top-card-section__information",
    bizform: ".pv-top-card-section__body ul.bizform",
    personDetails : ".pv-top-card-section__information.mt3",
    company : {
        actionBar : ".org-top-card-module__company-actions-bar .org-top-card-actions",
        isCom : ".company-main-info-company-descriptions",
        title : ".org-top-card-module__details .org-top-card-module__name",
        logo : ".org-top-card-module__container .org-top-card-module__logo",
        about : ".org-about-us-organization-description .org-about-us-organization-description__text.description",
        specailites : ".org-about-company-module__org-info .org-about-company-module__specialities",
        website : ".org-about-company-module__org-info .org-about-company-module__company-page-url a",
        size : ".org-about-company-module__org-info .org-about-company-module__staff-count-range",
        founded : ".org-about-company-module__org-info .org-about-company-module__founded-year",
        industry : ".org-about-company-module__org-info .org-about-company-module__industry"
    }

};
var actions = [
    'Edit',
    'Copy',
    'Save'
];

// $('.company-main-info-company-descriptions') 
// $('.org-top-card-module__details .org-top-card-module__name').text().trim() //company title
// $('.org-top-card-module__container .org-top-card-module__logo').attr('src') // company logo
// $('.org-about-us-organization-description .org-about-us-organization-description__text.description').text() //about-us
// $('.org-about-company-module__org-info .org-about-company-module__specialities').text().trim() // compnay specailites
// $('.org-about-company-module__org-info .org-about-company-module__company-page-url a').attr('href') // company web-link
// $('.org-about-company-module__org-info .org-about-company-module__staff-count-range').text().trim() //company size
// $('.org-about-company-module__org-info .org-about-company-module__founded-year').text().trim() //company founded
// $('.org-about-company-module__org-info .org-about-company-module__industry').text().trim() //company industry

var LINKEDIN = {
    currentPage: null,
    isCompany : function() {
        if($(SELECTOR.company.isCom).length > 0) {
            return true;
        } else {
            return false;
        }
    },
    init: function() {
        setTimeout(function() {
            if ($(SELECTOR.profileCard).length > 0 || LINKEDIN.isCompany()) {
                var Interval  = setInterval(function() {
                    if (LINKEDIN.currentPage != window.location.href && $(SELECTOR.profileCard).length > 0 || LINKEDIN.isCompany()) {
                        LINKEDIN.currentPage = window.location.href;
                        if(LINKEDIN.isCompany()) {
                            SELECTOR.profileCard = ".org-top-card-module.org-top-card-module--non-lcp-page.ember-view";
                            SELECTOR.bizform = ".bizform-company";
                            LINKEDIN.appendCompanyBtn();
                            LINKEDIN.bindActions();
                            clearInterval(Interval);
                        } else {
                            LINKEDIN.appendButtons(select(SELECTOR.profileCard)[0]);
                            LINKEDIN.appendTypehead();
                        }
                    }
                }, 500);
            } else {
                LINKEDIN.init();
            }
        }, 1000);
    },
    personId : "",
    companyId : "",
    tempUserObj : {},
    tempComObj : {},
    showPersonList : function(r, elm) {
        console.log(r);
        $(".typeahead-list-panel").empty("");
        if(r.length > 0) {
            var list = '<ul style="list-style : none;">'
            for(var z = 0; z < r.length; z++){
                list += '<li id="' + r[z]._id + '">'+ r[z]._id + '&nbsp;&nbsp;&nbsp;&nbsp;' + r[z].name + '&nbsp;&nbsp;&nbsp;&nbsp;' + r[z].address.country + "</li>";
                $(document).on("click", "#" + r[z]._id + "", function() {
                    LINKEDIN.personId = $(this).attr('id');
                    console.log(LINKEDIN.personId);
                    if(elm !== undefined) {
                        $(elm).val("");    
                    }
                    $(".typeahead-list-panel").empty("");
                });
            }
            +"</ul>";
            $(".typeahead-list-panel").append(list);
        } else {
            $(".typeahead-list-panel").empty("");
        }
    },
    appendTypehead : function() {
        console.log("hello typehead");
        $(".ally-typeahead123-panel").remove();
        var element = '<div class="pv-top-card-section__information mt3 ally-typeahead123-panel">'
        + '<div class="type-ahead-input-wrapper">'
        + '<div class="type-ahead-input">'
        + '  <label for="ally-typeahead123" class="visually-hidden">'
        + '      Search'
        + '  </label>'
        + '  <input aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="Search" autocorrect="off" autocapitalize="off" id="ally-typeahead123" role="combobox" class="ember-text-field typeahead" aria-expanded="false"></input>'
        + '  <div class="type-ahead-input-icons">'
        + '  </div>'
        + '</div>'
        + '</div>'
        + '<div class="typeahead-list-panel"></div>'
        + '</div>';

        $(SELECTOR.personDetails).after(element);
        $(".ally-typeahead123-panel").hide();
        typeahead.create("#ally-typeahead123", function(elm) {
            if($(elm).val() !== "" && $(elm).val() !== undefined) {
                service.queryPerson({
                    "name" : {
                        '$regex': $(elm).val()
                    }
                }, function(r) {
                    LINKEDIN.showPersonList(r, elm);
                });
            } else {
                $(".typeahead-list-panel").empty("");
            }
        });
    },
    appendCompanyBtn : function() {
        console.log("Append COMPANY UI");
        var actionBar = $(SELECTOR.company.actionBar);
        $("#copyUserInfo").remove();
        $("body").append('<input style="opacity:0;" type="text" id="copyUserInfo">');
        var addBtn = "";
        for(var a = 0; a < actions.length; a++) {
            addBtn += '<button id="ember8566" action="' + actions[a] + '" class="org-top-card-actions__follow-btn mr1 button-primary-medium org-hover-button ember-view">  <span class="org-hover-button__hover-label">'
                    + actions[a]
                    + '</span>'
                    + '<span aria-hidden="true" class="org-hover-button__normal-label">' + actions[a] + '</span>'
                    + '</button>';
        }
        var form = '<ul class="bizform-company" style="list-style:none;">'

        + '<li><div class="fieldgroup"><label>Title</label><input type="text" name="title"></div></li>'
        + '<li><div class="fieldgroup"><label>Logo</label><input type="text" name="logo"></div></li>'
        + '<li><div class="fieldgroup"><label>About</label><input type="text" name="about"></div></li>'        

        + '<li><div class="fieldgroup"><label>State</label><input type="text" name="specailites"></div></li>'
        + '<li><div class="fieldgroup"><label>Country</label><input type="text" name="type"></div></li>'

        + '<li><div class="fieldgroup"><label>Image URL</label><input type="text" name="size"></div></li>'
        + '<li><div class="fieldgroup"><label>Company</label><input type="text" name="website"></div></li>'
        + '<li><div class="fieldgroup"><label>Education</label><input type="text" name="founded"></div></li>'

        + '<li><button class="primary top-card-action" action="closeForm" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Close</span></button></li>'
        + '<li><button action="saveForm" class="primary top-card-action" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Save</span></button></li>'
        + '</ul>';
        $(actionBar).append(addBtn);
        $('.org-top-card-module__company-actions-bar').after(form);
        $('.bizform-company').hide();
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

        + '<li><div class="fieldgroup"><label>First Name</label><input type="text" name="firstname"></div></li>'
        + '<li><div class="fieldgroup"><label>Last Name</label><input type="text" name="lastname"></div></li>'
        + '<li><div class="fieldgroup"><label>Full Name</label><input type="text" name="name"></div></li>'        

        + '<li><div class="fieldgroup"><label>State</label><input type="text" name="address.state"></div></li>'
        + '<li><div class="fieldgroup"><label>Country</label><input type="text" name="address.country"></div></li>'

        + '<li><div class="fieldgroup"><label>Image URL</label><input type="text" name="lk.imgurl"></div></li>'
        + '<li><div class="fieldgroup"><label>Company</label><input type="text" name="lk.company"></div></li>'
        + '<li><div class="fieldgroup"><label>Education</label><input type="text" name="lk.school"></div></li>'
        + '<li><div class="fieldgroup"><label>Headline</label><input type="text" name="lk.headline"></div></li>'

        + '<li><button class="primary top-card-action" action="closeForm" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Close</span></button></li>'
        + '<li><button action="saveForm" class="primary top-card-action" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Save</span></button></li>'
        + '</ul>';
        $(profileCard).find("button[action]").remove();
        $(SELECTOR.bizform).remove();
        $(SELECTOR.section__body).append(form);
        $(SELECTOR.bizform).hide();
        var path = "person/" + LINKEDIN.getUsername();
        service.queryPerson({
            "lk.url": window.location.href
        }, function(r) {
            if (r.length === 1) {
                var view = '<button style="margin:8px;" class="primary top-card-action" action="getFromServer"><span class="default-text">Already Exist</span></button>';
                view = view + '<button style="margin:8px;" class="primary top-card-action" action="' + actions[1] + '"><span class="default-text">' + actions[1] + '</span></button>';
                $(actionsBox).append(view);
                LINKEDIN.bindActions(r[0]);
                LINKEDIN.personId = r[0]._id;
                $(".ally-typeahead123-panel").show();
            }  else if (r.length > 1) {
                for (var i = 0; i < actions.length; i++) {
                    var actn = actions[i];
                    view = '<button style="margin:8px;" class="primary top-card-action" action="' + actn + '"><span class="default-text">' + actn + '</span></button>';
                    $(actionsBox).append(view);
                }
                LINKEDIN.bindActions();
                $(".ally-typeahead123-panel").show();
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
                    "address.country" : add1
                }, function(r) {
                    if (r.length === 1) {
                        var view = '<button style="margin:8px;" class="primary top-card-action" action="getFromServer"><span class="default-text">Already Exist</span></button>';
                        view = view + '<button style="margin:8px;" class="primary top-card-action" action="' + actions[1] + '"><span class="default-text">' + actions[1] + '</span></button>';
                        $(actionsBox).append(view);
                        LINKEDIN.bindActions(r[0]);
                        LINKEDIN.personId = r[0]._id;
                        $(".ally-typeahead123-panel").show();
                    } else if (r.length > 1) {
                        for (var i = 0; i < actions.length; i++) {
                            var actn = actions[i];
                            view = '<button style="margin:8px;" class="primary top-card-action" action="' + actn + '"><span class="default-text">' + actn + '</span></button>';
                            $(actionsBox).append(view);
                        }
                        LINKEDIN.bindActions();
                        $(".ally-typeahead123-panel").show();
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
                    }
                });
            }
        });
    },
    copyUserInfo: function(a) {
        var USER = "";
        if(a === 1) {
            USER = LINKEDIN.getCompanyInfo();
        } else {
            USER = LINKEDIN.getUserInfo();
        }
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
                    if(LINKEDIN.isCompany()){
                        LINKEDIN.editCompany();
                    } else {
                        LINKEDIN.editUser();
                        $(SELECTOR.bizform).show();
                    }
                    break;
                case actions[1]:
                    LINKEDIN.editUser();
                    break;
                case actions[2]:
                    if(LINKEDIN.isCompany()) {
                        service.saveCompany(LINKEDIN.getCompanyInfo(), function(r) {
                            console.log(r);
                            LINKEDIN.statusCompany(r);
                        });
                    } else {
                        service.savePerson(LINKEDIN.getUserInfo(), function(r) {
                            console.log(r);
                            LINKEDIN.statusPerson(r);
                        });
                    }
                    break;
                case "getFromServer":
                    LINKEDIN.editUser(uu);
                    $(SELECTOR.bizform).show();
                    break;
                case "closeForm":
                    LINKEDIN.tempUserObj = {};
                    LINKEDIN.tempComObj = {};
                    $(SELECTOR.bizform).hide();
                    break;
                case "saveForm":
                    LINKEDIN.saveUser();
                    break;
            }
        });
    },
    statusPerson : function(res) {
        if(res.statusText !== undefined && res.statusText === "error"){
            alert("Error unable to save please try again later.");
        } else {
            LINKEDIN.appendButtons(select(SELECTOR.profileCard)[0]);
        }
    },
    statusCompany : function(res) {
        if(res.statusText !== undefined && res.statusText === "error"){
            alert("Error unable to save please try again later.");
        } else {
            console.log(res);
            // LINKEDIN.appendButtons(select(SELECTOR.profileCard)[0]);
        }
    },
    onChangeInput : function(output, key, input) {
        if(key.indexOf(".") > -1) {
            key = key.split(".");
            var a = output;
            for(var x = 0; x < key.length - 1; x++) {
                a = a[key[x]];
            }
            a[key[key.length - 1]] = input;
        } else {
            output[key] = input;
        }
    },
    saveUser: function() {
        var inputs = $(SELECTOR.bizform).find("input[name]");
        var USER = "";
        if(LINKEDIN.isCompany()){
            USER = LINKEDIN.tempComObj;
        } else {
            USER = LINKEDIN.tempUserObj;
        }
        for (var i = 0; i < inputs.length; i++) {
            LINKEDIN.onChangeInput(USER, $(inputs[i]).attr("name"), $(inputs[i]).val());
        }
        if(LINKEDIN.isCompany()) {
            service.saveCompany(USER, function(r) {
                LINKEDIN.statusPerson(r);
            });
        } else {
            service.savePerson(USER, function(r) {
                LINKEDIN.statusCompany(r);
            });
        }
        
    },
    editUser: function(uu) {
        uu = uu ? uu : LINKEDIN.getUserInfo();
        var inputs = $(SELECTOR.bizform).find("input[name]");
        for (var i = 0; i < inputs.length; i++) {
            $(inputs[i]).change(function() {
                console.log($(this).val());
            });
            var v,key = $(inputs[i]).attr("name");
            if(key.indexOf(".") > -1){
                key = key.split(".");
                v = uu;
                for(var x = 0; x < key.length; x++){
                    v = v[key[x]];
                }
            } else {
                v = uu[$(inputs[i]).attr("name")];
            }
            if(v !== undefined) {
                $(inputs[i]).val(v);
            }
        }
        LINKEDIN.copyUserInfo();
    },
    editCompany : function() {
        LINKEDIN.tempComObj = {};
        var uu = LINKEDIN.getCompanyInfo();
        var inputs = $('.bizform-company').find("input[name]");
        for (var i = 0; i < inputs.length; i++) {
            $(inputs[i]).change(function() {
                console.log($(this).val());
            });
            var v,key = $(inputs[i]).attr("name");
            if(key.indexOf(".") > -1){
                key = key.split(".");
                v = uu;
                for(var x = 0; x < key.length; x++){
                    v = v[key[x]];
                }
            } else {
                v = uu[$(inputs[i]).attr("name")];
            }
            if(v !== undefined) {
                $(inputs[i]).val(v);
            }
        }
        $('.bizform-company').show();
        LINKEDIN.copyUserInfo(1);
    },
    getCompanyInfo: function() {
        LINKEDIN.tempComObj = {};
        var href = window.location.href;
        var company = {
            'title': $(SELECTOR.company.title).text().trim(),
            // 'info': "",
            'logo': $(SELECTOR.company.logo).attr('src'),
            'about': $(SELECTOR.company.about).text(),
            'specailites': $(SELECTOR.company.specailites).text().trim(),
            'website': $(SELECTOR.company.website).attr('href'),
            'founded': $(SELECTOR.company.founded).text().trim(),
            'size': $(SELECTOR.company.size).text().trim(),
            'type': $(SELECTOR.company.industry).text().trim(),
            // 'persons': [{ type: Schema.ObjectId, ref: "Person" }],
            // 'phone': [],
            // 'mobile': [],
            // 'rating': Number,
            // 'address': [],
            // 'country': String
        };

        if(LINKEDIN.companyId !== undefined && LINKEDIN.companyId !== "") {
               company["_id"] = LINKEDIN.companyId;
        }
        LINKEDIN.tempComObj = company;
        console.log(LINKEDIN.tempComObj);
        return company;
    },
    getUserInfo: function() {
        LINKEDIN.tempUserObj = {};
        var profileCard = select(SELECTOR.profileCard)[0];
        var href = window.location.href,
            USER = null;
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
                lk: {
                    url: href,
                    username: LINKEDIN.getUsername(),
                    imgurl: select(SELECTOR.img, profileCard)[0].src,
                    headline: select(SELECTOR.headline, profileCard)[0].textContent.trim(),
                    company: select(SELECTOR.company, profileCard)[0].textContent.trim(),
                    school: select(SELECTOR.school, profileCard)[0].textContent.trim(),
                }
            }
            if(LINKEDIN.personId !== undefined && LINKEDIN.personId !== "") {
               USER["_id"] = LINKEDIN.personId;
            }
        }
        LINKEDIN.tempUserObj = USER;
        console.log(LINKEDIN.tempUserObj);
        return USER;
    },
    getInfo: function() {
        LINKEDIN.tempUserObj = {};
        var href = window.location.href,
            USER = null;
        if(LINKEDIN.isCompany()) {
            USER = {
                'title': $(SELECTOR.company.title).text().trim(),
                // 'info': "",
                'logo': $(SELECTOR.company.logo).attr('src'),
                'about': $(SELECTOR.company.about).text(),
                'specailites': $(SELECTOR.company.specailites).text().trim(),
                'website': $(SELECTOR.company.website).attr('href'),
                'founded': $(SELECTOR.company.founded).text().trim(),
                'size': $(SELECTOR.company.size).text().trim(),
                'type': $(SELECTOR.company.industry).text().trim(),
                // 'persons': [{ type: Schema.ObjectId, ref: "Person" }],
                // 'phone': [],
                // 'mobile': [],
                // 'rating': Number,
                // 'address': [],
                // 'country': String
            };
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
                    lk: {
                        url: href,
                        username: LINKEDIN.getUsername(),
                        imgurl: select(SELECTOR.img, profileCard)[0].src,
                        headline: select(SELECTOR.headline, profileCard)[0].textContent.trim(),
                        company: select(SELECTOR.company, profileCard)[0].textContent.trim(),
                        school: select(SELECTOR.school, profileCard)[0].textContent.trim(),
                    }
                }
                
            }
        }

        if(LINKEDIN.personId !== undefined && LINKEDIN.personId !== "") {
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
