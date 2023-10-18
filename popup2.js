import { getActiveTabURL } from "./utils.js";
var currentDomain = '';
var data_null = {
  list_keyword: '',
  desc: '',
  address: '',
  phone: '',
  email: '',
  link_facebook: '',
  link_instagram: '',
  link_twitter: '',
  link_youtube: '',
  link_linkedin: '',
  link_pinterest: '',
  link_tiktok: '',
  link_googleplay: '',
  link_appstore: '',
};
const sendMessage = (activeTab, action, data) => {
  chrome.tabs.sendMessage(activeTab.id, { action: action, data: data });
}

const activeTab = await getActiveTabURL();

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    if (request.type === "link_social" && request.domain === currentDomain) {
      add_href("facebook", request.data.link_facebook);
      add_href("instagram", request.data.link_instagram);
      add_href("twitter", request.data.link_twitter);
      add_href("youtube", request.data.link_youtube);
      add_href("linkedin", request.data.link_linkedin);
      add_href("pinterest", request.data.link_pinterest);
      add_href("tiktok", request.data.link_tiktok);
      add_href("ggplay", request.data.link_googleplay);
      add_href("appstore", request.data.link_appstore);
      add_input("phone", request.data.phone);
      add_input("email", request.data.str_email);
      set_data_local_storage(false);

    }
  }
);
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", doSomething);
} else {
  doSomething();
}
function doSomething() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    var currentUrl = currentTab.url;
    currentDomain = extractDomain(currentUrl);
    currentDomain = currentDomain.replace("www.", "");


    var timeout = null;
    $('#list_keyword_ex, #phone_ex, #email_ex, #address_ex, #desc_ex').on('input', function () {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        // let data_tmp = JSON.parse(chrome.storage.local.get([currentDomain]));
        set_data_local_storage(true);
      }, 2000);
    });

    $("#domain_name").text(currentDomain);
    $("#domain_name").removeClass("d-none");
    $.ajax({
      method: 'post',
      url: 'https://trustsites.net/tool/trung/api_extension/check_domain.php',
      data: {
        key: 'HPHA*HFN$%*',
        domain: currentDomain,
      },
      success: function (data) {
        let data_tmp = get_data_local_storage();
        console.log(data_tmp);

        if (data_tmp && data_tmp.editing) {
          console.log("result.editing", data_tmp.editing);
          if (res.code == 'have') {
            $("#update_infor").text("Update");
          } else if (res.code == 'null') {
            $("#update_infor").text("Add");
          }
          $("#list_keyword_ex").val(data_tmp.list_keyword);
          $("#desc").val(data_tmp.desc);
          $("#address").val(data_tmp.address);
          add_href("facebook", data_tmp.link_facebook);
          add_href("instagram", data_tmp.link_instagram);
          add_href("twitter", data_tmp.link_twitter);
          add_href("youtube", data_tmp.link_youtube);
          add_href("linkedin", data_tmp.link_linkedin);
          add_href("pinterest", data_tmp.link_pinterest);
          add_href("tiktok", data_tmp.link_tiktok);
          add_href("ggplay", data_tmp.link_googleplay);
          add_href("appstore", data_tmp.link_appstore);
          add_input("phone", data_tmp.phone);
          add_input("email", data_tmp.str_email);


        } else {
          var res = JSON.parse(data);
          if (res.code == 'have') {
            $("#list_keyword_ex").val(res.list_keyword);
            $("#desc").val(res.desc);
            $("#address").val(res.address);

            sendMessage(activeTab, "SOCIAL_REPLACE");
            chrome.runtime.onMessage.addListener(
              function (request, sender, sendResponse) {
                if (request.type === "link_social_replace" && request.domain === currentDomain) {
                  add_input2("phone", res.phone, request.data.phone);
                  add_input2("email", res.email, request.data.str_email);
                  add_href2("facebook", res.link_facebook, request.data.link_facebook);
                  add_href2("instagram", res.link_instagram, request.data.link_instagram);
                  add_href2("twitter", res.link_twitter, request.data.link_twitter);
                  add_href2("youtube", res.link_youtube, request.data.link_youtube);
                  add_href2("linkedin", res.link_linkedin, request.data.link_linkedin);
                  add_href2("pinterest", res.link_pinterest, request.data.link_pinterest);
                  add_href2("tiktok", res.link_tiktok, request.data.link_tiktok);
                  add_href2("ggplay", res.link_googleplay, request.data.link_googleplay);
                  add_href2("appstore", res.link_appstore, request.data.link_appstore);
                  set_data_local_storage(false);
                }
              }
            );
            $("#update_infor").text("Update");
          } else if (res.code == 'null') {
            sendMessage(activeTab, "SOCIAL");
            $("#update_infor").text("Add");
          }
          setTimeout(function () {
            // let data_tmp = JSON.parse(chrome.storage.local.get([currentDomain]));
            set_data_local_storage(false);

          }, 1000);

        }

      }
    })

    $('#update_infor').click(function () {
      $("#loadingSpinner").hide();

      let list_keyword = $("#list_keyword_ex").val();
      let desc = $("#desc_ex").val();
      let phone = $("#phone_ex").val();
      let email = $("#email_ex").val();
      let address = $("#address_ex").val();

      let link_facebook = $(".button-list a.facebook").attr("href") != "#" ? $(".button-list a.facebook").attr("href") : "";
      let link_instagram = $(".button-list a.instagram").attr("href") != "#" ? $(".button-list a.instagram").attr("href") : "";
      let link_twitter = $(".button-list a.twitter").attr("href") != "#" ? $(".button-list a.twitter").attr("href") : "";
      let link_youtube = $(".button-list a.youtube").attr("href") != "#" ? $(".button-list a.youtube").attr("href") : "";
      let link_linkedin = $(".button-list a.linkedin").attr("href") != "#" ? $(".button-list a.linkedin").attr("href") : "";
      let link_pinterest = $(".button-list a.pinterest").attr("href") != "#" ? $(".button-list a.pinterest").attr("href") : "";
      let link_tiktok = $(".button-list a.tiktok").attr("href") != "#" ? $(".button-list a.tiktok").attr("href") : "";
      let link_googleplay = $(".button-list a.ggplay").attr("href") != "#" ? $(".button-list a.ggplay").attr("href") : "";
      let link_appstore = $(".button-list a.appstore").attr("href") != "#" ? $(".button-list a.appstore").attr("href") : "";


      $.ajax({
        method: 'post',
        url: 'https://trustsites.net/tool/trung/api_extension/update_domain.php',
        data: {
          key: 'HPHA*HFN$%*',
          auther_email: 'trungnguyen228801@gmail.com',
          domain: currentDomain,
          list_keyword,
          desc,
          phone,
          email,
          address,
          link_facebook,
          link_instagram,
          link_twitter,
          link_youtube,
          link_linkedin,
          link_pinterest,
          link_tiktok,
          link_googleplay,
          link_appstore,
        },
        beforeSend: function () { $("#overlay").show(); },
        success: function (data) {
          setTimeout(function () {
            $("#overlay").hide();
            var res = JSON.parse(data);
            if (res.code == '200') {

              $("#successAlert").show();
              $("#errorAlert").hide();
              $("#update_infor").text("Update");
              setTimeout(function () {
                $("#errorAlert, #successAlert").hide();
                // sendMessage(activeTab, "reloadPopup");

              }, 3000)
              set_data_local_storage(false);

            } else {
              $("#successAlert").hide();
              $("#errorAlert").show();
              $("#errorAlert").text(res.message)
              setTimeout(function () {
                $("#errorAlert, #successAlert").hide();
                // sendMessage(activeTab, "reloadPopup");

              }, 3000)
            }

          }, 1000);
        },
        error: function () {
          setTimeout(function () {
            $("#overlay").hide();
            $("#successAlert").hide();
            $("#errorAlert").show();
            setTimeout(function () {
              $("#errorAlert, #successAlert").hide();
            }, 3000)
          }, 1000);
        }
      })
    })
  });
}

function extractDomain(url) {
  const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/;
  const match = url.match(domainRegex);
  return match ? match[1] : null;
}

function add_href(name_social, href) {
  if (href) {
    $(".button-list ." + name_social + " button").removeClass("btn-outline-secondary").addClass("btn-outline-success");
    $(".button-list ." + name_social).attr("href", href);
  }
}
function add_href2(name_social, href, new_href) {
  if (href != '') {
    $(".button-list ." + name_social + " button").removeClass("btn-outline-secondary").addClass("btn-outline-success");
    $(".button-list ." + name_social).attr("href", href);
  } else {
    if (new_href != '') {
      $(".button-list ." + name_social + " button").removeClass("btn-outline-secondary").removeClass("btn-outline-success").addClass("btn-outline-warning");
      $(".button-list ." + name_social).attr("href", new_href);
    }
  }
}
function add_input(name_elm, val) {
  if (val != '') {
    $("#" + name_elm + "_ex").val(val);
  }
}
function add_input2(name_elm, val, new_val) {
  if (val != '') {
    $("#" + name_elm + "_ex").val(val);
  } else {
    if (new_val != '') {
      $("#" + name_elm + "_ex").val(new_val);
      $("#" + name_elm + "_ex").addClass("border border-warning");
    }
  }
}


function set_data_local_storage(editing) {
  sendMessage(activeTab, "SET_DATA_LOCAL_STORAGE", {
    data_ex: JSON.stringify({
      list_keyword: $("#list_keyword_ex").val(),
      desc: $("#desc_ex").val(),
      address: $("#address_ex").val(),
      phone: $("#phone_ex").val(),
      email: $("#email_ex").val(),
      link_facebook: $(".button-list .facebook").attr("href"),
      link_instagram: $(".button-list .instagram").attr("href"),
      link_twitter: $(".button-list .twitter").attr("href"),
      link_youtube: $(".button-list .youtube").attr("href"),
      link_linkedin: $(".button-list .linkedin").attr("href"),
      link_pinterest: $(".button-list .pinterest").attr("href"),
      link_tiktok: $(".button-list .tiktok").attr("href"),
      link_googleplay: $(".button-list .ggplay").attr("href"),
      link_appstore: $(".button-list .ppstore").attr("href"),
      editing
    })
  });
}

function get_data_local_storage() {
  sendMessage(activeTab, "GET_DATA_LOCAL_STORAGE");
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      // console.log(request);
      if (request.type === "data_local_storage") {
        return JSON.parse(request.data);
      }
    }
  );
}
