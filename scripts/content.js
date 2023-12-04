function convertDate(inputString) {
    // Parse the input date string
    const date = new Date(inputString);

    // Function to add leading zero for single digit numbers
    const pad = (num) => (num < 10 ? '0' + num : num);

    // Format the date and time components
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // getMonth() returns 0-11
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    // Combine components into the final format
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function singleElement(xpath, param_document, param_XPathResult, get_type) {
    var result = param_document.evaluate(xpath, param_document, null, param_XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    var element = result.singleNodeValue;
    var result = '';
    if (element) {
        if (get_type.type === 'attribute') {
            result = element.getAttribute(get_type.attr);
        } else if (get_type.type === 'text') {
            result = element.textContent.trim();
        } else {
            result = '';
        }
    }
    return result;
}

function listElements(xpath, param_document, param_XPathResult, get_type) {
    var result = param_document.evaluate(xpath, param_document, null, param_XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var node;
    var list_elm = [];
    while (node = result.iterateNext()) {
        list_elm.push(node);
    }
    var list_result = [];
    if (list_elm != []) {
        list_elm.forEach(element => {
            if (get_type.type === 'attribute') {
                list_result.push(element.getAttribute(get_type.attr));
            } else if (get_type.type === 'text') {
                list_result.push(element.textContent.trim());
            }
        });
    }
    return list_result;
}

chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
    let currentUrl = window.location.href;
    // Use the URL object to parse the URL and extract the domain
    let urlObject = new URL(currentUrl);
    let domain = urlObject.hostname.replace("www.", "");

    const { action, data } = obj;
    if (action == "GET_DATA_GAME") {
        if (domain == 'gamedistribution.com') {
            let link = singleElement("//a[contains(text(), 'Open') and @class='gd-button' and contains(@href,'https://html5.gamedistribution.com/')]", document, XPathResult, { 'type': 'attribute', 'attr': 'href' });
            let name = singleElement("//h1", document, XPathResult, { 'type': 'text' });
            let slug = currentUrl.split('https://gamedistribution.com/games/').pop();
            let time_published = convertDate(singleElement("//span[@class='label' and text()='Published']/../span[2]", document, XPathResult, { 'type': 'text' }));
            let game_type = singleElement("//span[@class='label' and text()='Type']/../span[2]", document, XPathResult, { 'type': 'text' });
            let web = singleElement("//span[@class='label' and text()='HTTPS ready']/../span[2]", document, XPathResult, { 'type': 'text' });
            let mobile = singleElement("//span[@class='label' and text()='Mobile ready']/../span[2]", document, XPathResult, { 'type': 'text' });
            let is_blood = singleElement("//span[@class='label' and text()='No Blood']/../span[2]", document, XPathResult, { 'type': 'text' });
            let is_kid = singleElement("//span[@class='label' and text()='Kids Friendly']/../span[2]", document, XPathResult, { 'type': 'text' });
            let dimensions = singleElement("//span[@class='label' and text()='Dimensions']/../span[2]", document, XPathResult, { 'type': 'text' });
            let company = singleElement("//span[@class='label company' and text()='Company']/../span[2]/a", document, XPathResult, { 'type': 'text' });

            let categories = []
            let list_categories = listElements("//span[@class='label' and text()='Categories']/..//a[@class='pill']", document, XPathResult, { 'type': 'text' });
            if (list_categories != []) {
                list_categories.forEach(function (item) {
                    categories.push({ 'name_cate': item });
                });
            }else{
                categories.push({'name_cate':'Non-genre'});
            }

            let tags = []
            let list_result_tags = listElements("//span[@class='label' and text()='Tags']/..//div[@class='tag-list']/a", document, XPathResult, { 'type': 'text' });
            if (list_result_tags != []) {
                list_result_tags.forEach(function (item) {
                    tags.push({ 'name_tag': item });
                });
            }
            let langs = []
            let list_result_langs = listElements("//span[@class='label' and text()='Languages']/..//div[@class='language-list']/a", document, XPathResult, { 'type': 'text' });
            if (list_result_langs != []) {
                list_result_langs.forEach(function (item) {
                    langs.push({ 'name_lang': item });
                });
            }
            let description = singleElement("//span[@class='label' and text()='Description']/../span[2]", document, XPathResult, { 'type': 'text' });
            chrome.runtime.sendMessage({
                type: 'add_game_distribution_extension',
                domain,
                data: {
                    link, name, slug, time_published, game_type, web, mobile, is_blood, is_kid, dimensions, company, categories, tags, langs, description,
                }
            })
        }

        if (domain == 'gamemonetize.com') {
            let link = singleElement("//div[@id='tabcliboarddirect']//textarea[@id='urlTextAreaId']", document, XPathResult, { 'type': 'text' });
            let name = singleElement("//h2", document, XPathResult, { 'type': 'attribute', 'attr': 'data-text' });
            let slug = currentUrl.replace('https://gamemonetize.com/', "").replace('-game', "");
            let time_published = convertDate(singleElement("//div[@class='unit-card unit-card_accent dev-platform__item']/p[contains(text(),'Published')]/../following-sibling::p[1]", document, XPathResult, { 'type': 'text' }));
            let game_type = 'Html5';
            let web = 'Yes';
            let mobile = singleElement("//div[@class='unit-card unit-card_accent dev-platform__item']/p[contains(text(),'Mobile Ready')]", document, XPathResult, { 'type': 'text' }).split('Mobile Ready :').pop().split(' ').pop();
            let is_blood = 'No';
            let is_kid = 'Yes';
            let dimensions = singleElement("//div[@class='unit-card unit-card_accent dev-platform__item']/p[contains(text(),'Size')]/../following-sibling::p[1]", document, XPathResult, { 'type': 'text' });
            let company = singleElement("//*[@id='companyLinkId']", document, XPathResult, { 'type': 'text' });

            let categories = []
            let list_categories = listElements("//div[@class='unit-card unit-card_accent dev-platform__item']/p[contains(text(),'Category')]/../following-sibling::ul[1]/li/a", document, XPathResult, { 'type': 'text' });
            if (list_categories != []) {
                list_categories.forEach(function (item) {
                    categories.push({ 'name_cate': item });
                });
            }else{
                categories.push({'name_cate':'Non-genre'});
            }

            let tags = []
            let list_result_tags = listElements("//div[@class='unit-card unit-card_accent dev-platform__item']/p[contains(text(),'Tags')]/../following-sibling::ul[1]/li/a", document, XPathResult, { 'type': 'text' });
            if (list_result_tags != []) {
                list_result_tags.forEach(function (item) {
                    tags.push({ 'name_tag': item });
                });
            }

            let description = singleElement("//div[@class='unit-card unit-card_accent dev-platform__item']/p[contains(text(),'Description')]/../following-sibling::p[1]", document, XPathResult, { 'type': 'text' });
            let instruction = singleElement("//div[@class='unit-card unit-card_accent dev-platform__item']/p[contains(text(),'Instructions')]/../following-sibling::p[1]", document, XPathResult, { 'type': 'text' });
            chrome.runtime.sendMessage({
                type: 'add_game_monetize_extension',
                domain,
                data: {
                    link, name, slug, time_published, game_type, web, mobile, is_blood, is_kid, dimensions, company, categories, tags, description, instruction,
                }
            })
        }
    }
});