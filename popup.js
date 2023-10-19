import { getActiveTabURL } from "./utils.js";
var currentDomain = '';

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
    if (request.type === "lastest_update_popup" && request.domain === currentDomain) {
      let data_all_popup = JSON.parse(request.data);
      $("#list_keyword_ex").val(data_all_popup.list_keyword);
      $("#list_service_ex").val(data_all_popup.list_service);
      $("#desc_ex").val(data_all_popup.desc);
      $("#address_ex").val(data_all_popup.address);
      add_input("phone", data_all_popup.phone);
      add_input("email", data_all_popup.email);

      add_href("facebook", data_all_popup.link_facebook);
      add_href("instagram", data_all_popup.link_instagram);
      add_href("twitter", data_all_popup.link_twitter);
      add_href("youtube", data_all_popup.link_youtube);
      add_href("linkedin", data_all_popup.link_linkedin);
      add_href("pinterest", data_all_popup.link_pinterest);
      add_href("tiktok", data_all_popup.link_tiktok);
      add_href("ggplay", data_all_popup.link_googleplay);
      add_href("appstore", data_all_popup.link_appstore);
      update_btn_editing_data_server(data_all_popup.editing);

    }
    if (request.type === "reset_local_storage" && request.domain === currentDomain) {
      update_btn_editing_data_server(false);
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
    $('#list_keyword_ex, #list_service_ex, #phone_ex, #email_ex, #address_ex, #desc_ex').on('input', function () {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        // let data_tmp = JSON.parse(chrome.storage.local.get([currentDomain]));
        set_data_local_storage(true);
      }, 2000);
    });

    $("#domain_name").text(currentDomain);
    $("#domain_name").removeClass("d-none");
    
    check_domain({change_editing:false, editing:false});
    $('#btn_get_data').click(function () {
      check_domain({change_editing:true, editing:false});
    });
    $('#btn_editing').click(function () {
      check_domain({change_editing:true, editing:true});
    });

    $('#btn_send_data').click(function () {
      $("#loadingSpinner").hide();

      let list_keyword = $("#list_keyword_ex").val();
      let list_service = $("#list_service_ex").val();
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
          auther_email: 'anhthuh481@gmail.com',
          domain: currentDomain,
          list_keyword,
          list_service,
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
              sendMessage(activeTab, "RESET_LOCAL_STORAGE");

              $("#successAlert").show();
              $("#errorAlert").hide();
              $("#btn_send_data").text("Update");
              setTimeout(function () {
                $("#errorAlert, #successAlert").hide();

              }, 1500)
              set_data_local_storage(false);

            } else {
              $("#successAlert").hide();
              $("#errorAlert").show();
              $("#errorAlert").text(res.message)
              setTimeout(function () {
                $("#errorAlert, #successAlert").hide();
                // sendMessage(activeTab, "reloadPopup");

              }, 1500)
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
            }, 1500)
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
  if (href != '' && href != '#') {
    $(".button-list ." + name_social + " button").removeClass("btn-outline-secondary").addClass("btn-outline-success");
    $(".button-list ." + name_social).attr("href", href);
  }
}
function add_href2(name_social, href, new_href) {
  if (href != '' && href != '#') {
    $(".button-list ." + name_social + " button").removeClass("btn-outline-secondary").addClass("btn-outline-success");
    $(".button-list ." + name_social).attr("href", href);
  } else {
    if (new_href != '' && new_href != '#') {
      $(".button-list ." + name_social + " button").removeClass("btn-outline-secondary").removeClass("btn-outline-success").addClass("btn-outline-warning");
      $(".button-list ." + name_social).attr("href", new_href);
    }
  }
}
function add_href3(name_social, href, new_href) {
  if(href != new_href){
    if (new_href != '' && new_href != '#') {
      $(".button-list ." + name_social + " button").removeClass("btn-outline-secondary").addClass("btn-outline-success");
    }else{
      $(".button-list ." + name_social + " button").removeClass("btn-outline-success").removeClass("btn-outline-warning").addClass("btn-outline-secondary");
    }
    $(".button-list ." + name_social).attr("href", new_href);
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
      list_service: $("#list_service_ex").val(),
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
      link_appstore: $(".button-list .appstore").attr("href"),
      editing
    }),
    editing
  });
}

function check_domain(obj_editing){
  $.ajax({
    method: 'post',
    url: 'https://trustsites.net/tool/trung/api_extension/check_domain.php',
    data: {
      key: 'HPHA*HFN$%*',
      domain: currentDomain,
    },
    success: function (data) {
      var res = JSON.parse(data);
      let isHasData = false;
      sendMessage(activeTab, "GET_DATA_LOCAL_STORAGE", obj_editing);
      chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {

          if (request.type === "data_local_storage" && isHasData == false) {
            isHasData = true;
            
            
            if (request.data != null &&  JSON.parse(request.data).editing) {
              let data_tmp = JSON.parse(request.data);
              update_btn_editing_data_server(data_tmp.editing);

              if (res.code == 'have') {
                $("#btn_send_data").text("Update");
              } else if (res.code == 'null') {
                $("#btn_send_data").text("Add");
              }
              $("#list_keyword_ex").val(data_tmp.list_keyword);
              $("#list_service_ex").val(data_tmp.list_service);
              $("#desc_ex").val(data_tmp.desc);
              $("#address_ex").val(data_tmp.address);
              add_input("phone", data_tmp.phone);
              add_input("email", data_tmp.email);

              add_href("facebook", data_tmp.link_facebook);
              add_href("instagram", data_tmp.link_instagram);
              add_href("twitter", data_tmp.link_twitter);
              add_href("youtube", data_tmp.link_youtube);
              add_href("linkedin", data_tmp.link_linkedin);
              add_href("pinterest", data_tmp.link_pinterest);
              add_href("tiktok", data_tmp.link_tiktok);
              add_href("ggplay", data_tmp.link_googleplay);
              add_href("appstore", data_tmp.link_appstore);

            } else {
              update_btn_editing_data_server(false);

              if (res.code == 'have') {
                $("#list_keyword_ex").val(res.list_keyword);
                $("#list_service_ex").val(res.list_service);
                $("#desc_ex").val(res.desc);
                $("#address_ex").val(res.address);
                let isHasDataSecond = false;
                sendMessage(activeTab, "SOCIAL_REPLACE");
                chrome.runtime.onMessage.addListener(
                  function (request, sender, sendResponse) {
                    if (request.type === "link_social_replace" && request.domain === currentDomain && isHasDataSecond == false) {
                      isHasDataSecond = true;
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
                      // set_data_local_storage(false);
                    }
                  }
                );
                $("#btn_send_data").text("Update");
              } else if (res.code == 'null') {
                sendMessage(activeTab, "SOCIAL");
                $("#btn_send_data").text("Add");
              }
            }
          }
        }
      );

    }
  })
}

function update_btn_editing_data_server(status_editing){
  console.log("status_editing", status_editing);
  if(!status_editing){
    if(!$("#btn_editing").hasClass("grayscale-button")){
      $("#btn_editing").addClass("grayscale-button");
    }
    $("#btn_get_data").removeClass("grayscale-button");
  }else{
    $("#btn_editing").removeClass("grayscale-button");
    if(!$("#btn_get_data").hasClass("grayscale-button")){
      $("#btn_get_data").addClass("grayscale-button");
    }
  }
}


$('#form_extension').on('click', '.btn-edit', function () {
  $('#link_edit_ex').val($(this).attr('href'));
  $('#form_extension #title_link_edit_ex').text('Link '+$(this).attr('data-link'));
})


$('#form_extension #update_link_ex').on('click',function () {
  if($(this).attr('href') != $('#link_edit_ex').val()){
    let name = $('#form_extension #title_link_edit_ex').text().replace("Link ","");
    add_href3(name, $(this).attr('href'), $('#link_edit_ex').val())
    $('#form_extension .btn-cancel').click();
    set_data_local_storage(true);
  }
  
})
