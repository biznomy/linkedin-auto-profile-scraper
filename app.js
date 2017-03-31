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
    bizform: ".pv-top-card-section__body ul.bizform"
};

var actions = ['Edit', 'Copy', 'Save'];

var LINKEDIN = {
    currentPage: null,
    init: function() {
        setTimeout(function() {
            if ($(SELECTOR.profileCard).length > 0) {
                setInterval(function() {
                    if (LINKEDIN.currentPage != window.location.href && $(SELECTOR.profileCard).length > 0) {
                        LINKEDIN.currentPage = window.location.href;
                        LINKEDIN.appendButtons(select(SELECTOR.profileCard)[0]);
                    }
                }, 500);
            } else {
                LINKEDIN.init();
            }
        }, 1000);
    },
    appendButtons: function(profileCard) {
        var actionsBox = select(SELECTOR.actionsBox, profileCard)[0];
        if ($(actionsBox).length < 1) {
            return '';
        }
        console.log("Append UI");
        $("#copyUserInfo").remove();
        $("body").append('<input style="opacity:0;" type="text" id="copyUserInfo">');
        var form = '<ul class="bizform"><li><label></label><div class="fieldgroup"><input type="text" name="username"></div></li>' + '<li><label></label><div class="fieldgroup"><input type="text" name="imgUrl"></div></li>' + '<li><label></label><div class="fieldgroup"><input type="text" name="name"></div></li>' + '<li><label></label><div class="fieldgroup"><input type="text" name="headline"></div></li>' + '<li><label></label><div class="fieldgroup"><input type="text" name="company"></div></li>' + '<li><label></label><div class="fieldgroup"><input type="text" name="school"></div></li>' + '<li><label></label><div class="fieldgroup"><input type="text" name="location"></div></li>' + '<li> <button class="primary top-card-action" action="closeForm" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Close</span></button></li>' + '<li> <button action="saveForm" class="primary top-card-action" style="margin:13px;background: #0084bf;font-weight: 600;height: 36px;color: #fff;overflow: hidden;padding: 0px 24px;"><span class="default-text">Save</span></button></li>' + '</ul>';
        $(profileCard).find("button[action]").remove();
        $(SELECTOR.bizform).remove();
        $(SELECTOR.section__body).append(form);
        $(SELECTOR.bizform).hide();
        var path = "person/" + LINKEDIN.getUsername();
        service.queryPerson({
            "lk.url": window.location.href
        }, function(r) {
            if (r.length > 1) {
                var view = '<button style="margin:8px;" class="primary top-card-action" action="getFromServer"><span class="default-text">Already Exist</span></button>';
                view = view + '<button style="margin:8px;" class="primary top-card-action" action="' + actions[1] + '"><span class="default-text">' + actions[1] + '</span></button>';
                $(actionsBox).append(view);
                LINKEDIN.bindActions(result.data[0]);

            } else {
                for (var i = 0; i < actions.length; i++) {
                    var actn = actions[i];
                    view = '<button style="margin:8px;" class="primary top-card-action" action="' + actn + '"><span class="default-text">' + actn + '</span></button>';
                    $(actionsBox).append(view);
                }
                LINKEDIN.bindActions();

            }
        });

        // AJAX.get(path, function(result) {
        //     if (!result.status) {
        //         for (var i = 0; i < actions.length; i++) {
        //             var actn = actions[i];
        //             view = '<button style="margin:8px;" class="primary top-card-action" action="' + actn + '"><span class="default-text">' + actn + '</span></button>';
        //             $(actionsBox).append(view);
        //         }
        //         LINKEDIN.bindActions();
        //     } else {
        //         if (result.data && result.data.length > 0) {
        //             var view = '<button style="margin:8px;" class="primary top-card-action" action="getFromServer"><span class="default-text">Already Exist</span></button>';
        //             view = view + '<button style="margin:8px;" class="primary top-card-action" action="' + actions[1] + '"><span class="default-text">' + actions[1] + '</span></button>';
        //             $(actionsBox).append(view);
        //             LINKEDIN.bindActions(result.data[0]);
        //         }
        //     }
        // });
        var allFields = $(SELECTOR.bizform).find("input[name]");
        allFields.keyup(function() {
            LINKEDIN.copyUserInfo();
        });

    },
    copyUserInfo: function() {
        var allFields = $(SELECTOR.bizform).find("input[name]");
        var str = "";
        allFields.each(function() {
            str += str == "" ? $(this).val() : "," + $(this).val();
        });
        $('#copyUserInfo').val(str);
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
                    var uu = LINKEDIN.getUserInfo();
                    service.savePerson(uu, function(r) {
                        console.log(r);
                        //AJAX.displayResponse(r);
                    });
                    break;
                case "getFromServer":
                    LINKEDIN.editUser(uu);
                    $(SELECTOR.bizform).show();
                    break;
                case "closeForm":
                    $(SELECTOR.bizform).hide();
                    break;
                case "saveForm":
                    LINKEDIN.saveUser();
                    break;
            }
        });
    },
    saveUser: function() {
        var inputs = $(SELECTOR.bizform).find("input[name]");
        var USER = {};
        for (var i = 0; i < inputs.length; i++) {
            USER[$(inputs[i]).attr("name")] = $(inputs[i]).val();
        }
        service.savePerson(USER, function(r) {
            console.log(r);
            //AJAX.displayResponse(r);
        });
        // AJAX.post("linkedin", USER, function(r) {
        //     AJAX.displayResponse(r);
        // });
    },
    editUser: function(uu) {
        uu = uu ? uu : LINKEDIN.getUserInfo();
        var inputs = $(SELECTOR.bizform).find("input[name]");
        for (var i = 0; i < inputs.length; i++) {
            var v = uu[$(inputs[i]).attr("name")];
            $(inputs[i]).val(v);
        }
        LINKEDIN.copyUserInfo();
    },
    getUserInfo: function() {
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
                firstname: firstName,
                lastname: lastName,
                address: add1,
                lk: {
                    url: href,
                    name: select(SELECTOR.name, profileCard)[0].textContent.trim(),
                    username: LINKEDIN.getUsername(),
                    imgurl: select(SELECTOR.img, profileCard)[0].src,
                    headline: select(SELECTOR.headline, profileCard)[0].textContent.trim(),
                    company: select(SELECTOR.company, profileCard)[0].textContent.trim(),
                    school: select(SELECTOR.school, profileCard)[0].textContent.trim(),
                }
            }
        }
        console.log(USER);
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
