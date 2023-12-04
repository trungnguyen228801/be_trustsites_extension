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

    // $("#domain_name").text(currentDomain);
    // $("#domain_name").removeClass("d-none");

    $('#btn_send_data').click(function () {
      $("#loadingSpinner").hide();
      sendMessage(activeTab, "GET_DATA_GAME");
      chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
          let data_game = {};
          if ((request.type == "add_game_distribution_extension" || request.type == "add_game_monetize_extension")  && request.domain === currentDomain) {
            if(request.type == "add_game_distribution_extension"){
              data_game = {
                link: request.data.link,
                name: request.data.name,
                slug: request.data.slug,
                time_published: request.data.time_published,
                game_type: request.data.game_type,
                web: request.data.web,
                mobile: request.data.mobile,
                is_blood: request.data.is_blood,
                is_kid: request.data.is_kid,
                dimensions: request.data.dimensions,
                company: request.data.company,
                categories: JSON.stringify(request.data.categories),
                tags: JSON.stringify(request.data.tags),
                langs: JSON.stringify(request.data.langs),
                description: request.data.description,
                source: 0
              }

            }else if(request.type == "add_game_monetize_extension"){
              data_game = {
                link: request.data.link,
                name: request.data.name,
                slug: request.data.slug,
                time_published: request.data.time_published,
                game_type: request.data.game_type,
                web: request.data.web,
                mobile: request.data.mobile,
                is_blood: request.data.is_blood,
                is_kid: request.data.is_kid,
                dimensions: request.data.dimensions,
                company: request.data.company,
                categories: JSON.stringify(request.data.categories),
                tags: JSON.stringify(request.data.tags),
                description: request.data.description,
                instruction: request.data.instruction,
                source: 1
              }
            }
            $.ajax({
              method: 'post',
              url: 'https://www.freegames66.com/trung-api',
              data: {
                key: 'HPHA*HFN$%',
                'type': request.type,
                list_game: JSON.stringify([data_game])
              },
              beforeSend: function () { $("#overlay").show(); },
              success: function (data) {
                setTimeout(function () {
                  $("#overlay").hide();
                  var res = JSON.parse(data);
                  if (res.code == '200') {
                    $("#successAlert").show();
                    $("#errorAlert").hide();
                    $("#btn_send_data").text("Update");
                    setTimeout(function () {
                      $("#errorAlert, #successAlert").hide();
                    }, 1500)
      
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
          }
        }
      );
    })
  });
}

function extractDomain(url) {
  const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/;
  const match = url.match(domainRegex);
  return match ? match[1] : null;
}