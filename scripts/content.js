
chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
    let currentUrl = window.location.href;

// Use the URL object to parse the URL and extract the domain
let urlObject = new URL(currentUrl);
let domain = urlObject.hostname.replace("www.", "");

    const { action, data } = obj;
    if (action == "SOCIAL" || action == "SOCIAL_REPLACE") {

        let elm_facebook = document.querySelector("a[href^='https://facebook.com/'], a[href^='https://www.facebook.com/'], a[href^='http://facebook.com/'], a[href^='http://www.facebook.com/']");
        let link_facebook = elm_facebook ? elm_facebook.getAttribute("href") : "";

        let elm_instagram = document.querySelector("a[href^='https://instagram.com/'], a[href^='https://www.instagram.com/'], a[href^='http://instagram.com/'], a[href^='http://www.instagram.com/']");
        let link_instagram = elm_instagram ? elm_instagram.getAttribute("href") : "";

        let elm_twitter = document.querySelector("a[href^='https://twitter.com/'], a[href^='https://www.twitter.com/'], a[href^='http://twitter.com/'], a[href^='http://www.twitter.com/']");
        let link_twitter = elm_twitter ? elm_twitter.getAttribute("href") : "";

        let elm_youtube = document.querySelector("a[href^='https://youtube.com/'], a[href^='https://www.youtube.com/'], a[href^='http://youtube.com/'], a[href^='http://www.youtube.com/']");
        let link_youtube = elm_youtube ? elm_youtube.getAttribute("href") : "";

        let elm_linkedin = document.querySelector("a[href^='https://linkedin.com/'], a[href^='https://www.linkedin.com/'], a[href^='http://linkedin.com/'], a[href^='http://www.linkedin.com/']");
        let link_linkedin = elm_linkedin ? elm_linkedin.getAttribute("href") : "";

        let elm_pinterest = document.querySelector("a[href^='https://pinterest.com/'], a[href^='https://www.pinterest.com/'], a[href^='http://pinterest.com/'], a[href^='http://www.pinterest.com/']");
        let link_pinterest = elm_pinterest ? elm_pinterest.getAttribute("href") : "";

        let elm_tiktok = document.querySelector("a[href^='https://tiktok.com/'], a[href^='https://www.tiktok.com/'], a[href^='http://tiktok.com/'], a[href^='http://www.tiktok.com/']");
        let link_tiktok = elm_tiktok ? elm_tiktok.getAttribute("href") : "";

        let elm_googleplay = document.querySelector("a[href*='//play.google.com/store/apps/details?'], a[href*='//www.play.google.com/store/apps/details?'], a[href*='//play.google.com/store/apps/details?'], a[href*='//www.play.google.com/store/apps/details?']");
        let link_googleplay = elm_googleplay ? elm_googleplay.getAttribute("href") : "";
        
        let elm_appstore = document.querySelector("a[href*='//apps.apple.com/us/app/'], a[href*='//www.apps.apple.com/us/app/'], a[href*='//apps.apple.com/us/app/'], a[href*='//www.apps.apple.com/us/app/'], a[href*='//itunes.apple.com/us/app/'], a[href*='//www.itunes.apple.com/us/app/'], a[href*='//itunes.apple.com/us/app/'], a[href*='//www.itunes.apple.com/us/app/']");
        let link_appstore = elm_appstore ? elm_appstore.getAttribute("href") : "";

        //email
        const xpathExpression = "//*[contains(text(), '@')]";
        const result = document.evaluate(xpathExpression, document, null, XPathResult.ANY_TYPE, null);
        let str_email = '';
        let node = result.iterateNext();
        while (node) {
            const text = node.textContent;
            const emails = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g); // Regex để tìm email
            if (emails) {
                str_email = emails[0];
                break;
            }
            node = result.iterateNext();
        }
        //phone
        let elm_phone = document.querySelector('a[href^="tel:"]');
        let phone = elm_phone ? elm_phone.getAttribute("href").replace("tel:", "") : "";

        if(action == "SOCIAL"){
            chrome.runtime.sendMessage({
                type: 'link_social',
                domain,
                data:{
                    link_facebook, link_instagram, link_twitter, link_youtube, link_linkedin, link_pinterest, link_tiktok, phone, str_email, link_appstore, link_googleplay,
                }
            })
        }else{
            chrome.runtime.sendMessage({
                type: 'link_social_replace',
                domain,
                data:{
                    link_facebook, link_instagram, link_twitter, link_youtube, link_linkedin, link_pinterest, link_tiktok, phone, str_email, link_appstore, link_googleplay,
                }
            })
        }

    }else if(action == "SET_DATA_LOCAL_STORAGE"){
        localStorage.setItem('data_ex', data.data_ex);
        if(data.editing){
            chrome.runtime.sendMessage({
                type: 'lastest_update_popup',
                data:data.data_ex,
                domain
            })
        }
    }else if(action == "GET_DATA_LOCAL_STORAGE"){
        if(data.change_editing){
            changeEditing(data.editing);
        }
        chrome.runtime.sendMessage({
            type: 'data_local_storage',
            data:localStorage.getItem('data_ex'),
        })
    }else if(action == "RESET_LOCAL_STORAGE"){
        localStorage.removeItem('data_ex');
        chrome.runtime.sendMessage({
            type: 'reset_local_storage',
            domain
        })
    }
    
});

function setWithExpiry(key, value, ttl) {
	const now = new Date()

	// `item` is an object which contains the original value
	// as well as the time when it's supposed to expire
	const item = {
		value: value,
		expiry: now.getTime() + ttl,
	}
	localStorage.setItem(key, JSON.stringify(item))
}

function getWithExpiry(key) {
	const itemStr = localStorage.getItem(key)
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null
	}
	const item = JSON.parse(itemStr)
	const now = new Date()
	// compare the expiry time of the item with the current time
	if (now.getTime() > item.expiry) {
		// If the item is expired, delete the item from storage
		// and return null
		localStorage.removeItem(key)
		return null
	}
	return item.value;
}

function changeEditing(editing) {
    console.log("editing", editing);
    const itemStr = localStorage.getItem('data_ex');
	if (!itemStr) {
		return null;
	}
	const item = JSON.parse(itemStr);
    item.editing = editing;
    localStorage.setItem('data_ex', JSON.stringify(item))
}