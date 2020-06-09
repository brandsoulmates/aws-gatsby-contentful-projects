<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <script src="https://unpkg.com/contentful-ui-extensions-sdk@3"></script>
  <link rel="stylesheet" href="https://unpkg.com/contentful-ui-extensions-sdk@3/dist/cf-extension.css" />
  <style>
    ul {
      margin: 0;
      padding: 0;
    }

    li {
      list-style: none;
    }

    img {
      max-width: 50%;
      display: block;
      margin-bottom: 10px;
    }
    button:disabled{
      user-select: none;
      cursor: not-allowed;
      opacity: .5;
    }
    button:focus {
      outline: 0;
    }

    #previewEntry {
      width: 100%;
      border-color: #19819E;
      background-image: -webkit-gradient(linear,left bottom,left top,from(#26C0EB),to(#23B6DE));
      background-image: linear-gradient(0deg,#26C0EB,#23B6DE);
      background-size: 100% 200%;
      outline: 0 !important;
    }
     #previewEntry:disabled {
      user-select: none;
      cursor: not-allowed;
      opacity: .5;
      outline: 0 !important;
    }
    #localeDropDown {
      display: inline-block;
      font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
    }
    #localeDropDown > select {
      background-color: transparent;
      text-align-last: right;
      height: 1.5rem;
      border-width: 0px;
      border-style: initial;
      border-color: initial;
      border-image: initial;
      padding: 0px 1.5rem 0px 0px;
      outline: 0 !important;
      color: #536171;
    font-size: .875rem;
      font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;

    }

  </style>
</head>

<body style="margin: 0;">
  <div id="root" style="display:none">
    <div style="margin-bottom: 0.5rem; color: #8091a5; display: flex; justify-content: space-between;">
      <div>Locale</div>
      <div id="localeDropDown">
      	<select data-test-id="cf-ui-select" id="locale-select">
          <option value="en-US" id="us">en-US</option>
          <option value="en-GB" id="uk">en-GB</option>
          <option value="fr" id="fr">fr</option>
          <option value="de" id="de">de</option>
          <option value="ko" id="ko">ko</option>
          <option value="zh" id="zh">zh</option>
        	<option value="ja" id="ja">ja</option>
       </select>
      </div>
    </div>
    <span id="innerSpan">
      <a href="https://preview.paulhastings.com">
    	<button id="previewEntry" class="cf-btn-primary">Preview Entry</button>
      </a>
    </span>
  
    <div id="infoBox" style="margin-top: 1.285714285714286em; color: #8091a5;"></div>
    <div id="site" style="margin-top: 10px"></div>
    <ul id="history" style="margin-top: 10px; padding-left: 15px;"></ul>
  </div>
  <script>

function showExtension(extension, publishedState, displayedLocales) {
  document.getElementById('root').style.display = 'block';

    
  /** HTML CONSTANTS**/
  const localeDropdownMenu = document.getElementById('locale-select');
  let innerSpan = document.getElementById('innerSpan');
  let dropDown = document.getElementById('locale-select');
  let previewBtn = document.getElementById('previewEntry')
  
 	const pollingInterval = null;
  const pollingFrequency = 1000;
  
  const pageSlugs = {
      "en-US": {
        "Article": { 
          "parentId":"5if9xKprWvNrUyyfWPk9vc",
          "parentPath":"insights"
        },
        "ArticleCategory": { 
          "entryContentType": "ArticleCategory",
          "parentId":"5if9xKprWvNrUyyfWPk9vc",
          "parentPath":"insights"
        },
        "Event": { 
          "parentId":"1iNTN1YVOUMwz2QNZmudo3",
          "parentPath":"events"
        },
        "News": { 
          "parentId":"43jJTUzlBaamDwaKfJcbZf",
          "parentPath":"news"
        },
        "Office": { 
          "parentId":"4DxFkZfT33O7CBkHSXBIQF",
          "parentPath":"offices"
        },
        "Practice Area": { 
          "parentId":"23hSKEtDWwHSV3Gjx8rCzU",
          "parentPath":"practice-areas"
        },
        "Professional": { 
          "parentId":"1WMCfztCvBPa3ywF0FjyRi",
          "parentPath":"professionals"
        }
      },
      "fr": {
        "Article": { 
          "parentId":"5if9xKprWvNrUyyfWPk9vc",
          "parentPath":"publications"
        },
        "ArticleCategory": { 
          "parentId":"5if9xKprWvNrUyyfWPk9vc",
          "parentPath":"publications"
        },
        "Event": { 
          "parentId":"1iNTN1YVOUMwz2QNZmudo3",
          "parentPath":"événements"
        },
        "News": { 
          "parentId":"43jJTUzlBaamDwaKfJcbZf",
          "parentPath":"actualités"
        },
        "Office": { 
          "parentId":"4DxFkZfT33O7CBkHSXBIQF",
          "parentPath":"offices"
        },
        "Practice Area": { 
          "parentId":"23hSKEtDWwHSV3Gjx8rCzU",
          "parentPath":"domaines-dactivites"
        },
        "Professional": { 
          "parentId":"1WMCfztCvBPa3ywF0FjyRi",
          "parentPath":"professionnels"
        }
      },
      "de": {
        "Article": { 
          "parentId":"5if9xKprWvNrUyyfWPk9vc",
          "parentPath":"wichtiges"
        },
        "ArticleCategory": { 
          "parentId":"5if9xKprWvNrUyyfWPk9vc",
          "parentPath":"wichtiges"
        },
        "Event": { 
          "parentId":"1iNTN1YVOUMwz2QNZmudo3",
          "parentPath":"veranstaltungen"
        },
        "News": { 
          "parentId":"43jJTUzlBaamDwaKfJcbZf",
          "parentPath":"aktuelles"
        },
        "Office": { 
          "parentId":"4DxFkZfT33O7CBkHSXBIQF",
          "parentPath":"offices"
        },
        "Practice Area": { 
          "parentId":"23hSKEtDWwHSV3Gjx8rCzU",
          "parentPath":"rechtsgebiete"
        },
        "Professional": { 
          "parentId":"1WMCfztCvBPa3ywF0FjyRi",
          "parentPath":"anwaelte"
        }
      },
      "ko": {
        "Article": { 
          "parentId":"5if9xKprWvNrUyyfWPk9vc",
          "parentPath":"publication-items"
        },
        "ArticleCategory": { 
          "parentId":"5if9xKprWvNrUyyfWPk9vc",
          "parentPath":"publication-items"
        },
        "Event": { 
          "parentId":"1iNTN1YVOUMwz2QNZmudo3",
          "parentPath":"이벤트"
        },
        "News": { 
          "parentId":"43jJTUzlBaamDwaKfJcbZf",
          "parentPath":"뉴스"
        },
        "Office": { 
          "parentId":"4DxFkZfT33O7CBkHSXBIQF",
          "parentPath":"offices"
        },
        "Practice Area": { 
          "parentId":"23hSKEtDWwHSV3Gjx8rCzU",
          "parentPath":"업무분야"
        },
        "Professional": { 
          "parentId":"1WMCfztCvBPa3ywF0FjyRi",
          "parentPath":"구성원-소개"
        }
      },
      "zh": {
        "Article": { 
          "parentId":"5if9xKprWvNrUyyfWPk9vc",
          "parentPath":"出版物"
        },
        "ArticleCategory": { 
          "parentId":"5if9xKprWvNrUyyfWPk9vc",
          "parentPath":"出版物"
        },
        "Event": { 
          "parentId":"1iNTN1YVOUMwz2QNZmudo3",
          "parentPath":"活动事项"
        },
        "News": { 
          "parentId":"43jJTUzlBaamDwaKfJcbZf",
          "parentPath":"新闻"
        },
        "Office": { 
          "parentId":"4DxFkZfT33O7CBkHSXBIQF",
          "parentPath":"offices"
        },
        "Practice Area": { 
          "parentId":"23hSKEtDWwHSV3Gjx8rCzU",
          "parentPath":"执业领域"
        },
        "Professional": { 
          "parentId":"1WMCfztCvBPa3ywF0FjyRi",
          "parentPath":"专业人员"
        }
      },
      "ja": {
        "Article": { 
          "parentId":"5if9xKprWvNrUyyfWPk9vc",
          "parentPath":"publication-items"
        },
        "ArticleCategory": { 
          "parentId":"5if9xKprWvNrUyyfWPk9vc",
          "parentPath":"publication-items"
        },
        "Event": { 
          "parentId":"1iNTN1YVOUMwz2QNZmudo3",
          "parentPath":"セミナー・講演等"
        },
        "News": { 
          "parentId":"43jJTUzlBaamDwaKfJcbZf",
          "parentPath":"ニュース"
        },
        "Office": { 
          "parentId":"4DxFkZfT33O7CBkHSXBIQF",
          "parentPath":"offices"
        },
        "Practice Area": { 
          "parentId":"23hSKEtDWwHSV3Gjx8rCzU",
          "parentPath":"practice"
        },
        "Professional": { 
          "parentId":"1WMCfztCvBPa3ywF0FjyRi",
          "parentPath":"弁護士等プロフィール"
        }
      },
      "en-GB": {
        "Article": { 
          "parentId":"5if9xKprWvNrUyyfWPk9vc",
          "parentPath":"insights"
        },
        "ArticleCategory": { 
          "parentId":"5if9xKprWvNrUyyfWPk9vc",
          "parentPath":"insights"
        },
        "Event": { 
          "parentId":"1iNTN1YVOUMwz2QNZmudo3",
          "parentPath":"events"
        },
        "News": { 
          "parentId":"43jJTUzlBaamDwaKfJcbZf",
          "parentPath":"news"
        },
        "Office": { 
          "parentId":"4DxFkZfT33O7CBkHSXBIQF",
          "parentPath":"offices"
        },
        "Practice Area": { 
          "parentId":"23hSKEtDWwHSV3Gjx8rCzU",
          "parentPath":"practice-areas"
        },
        "Professional": { 
          "parentId":"1WMCfztCvBPa3ywF0FjyRi",
          "parentPath":"professionals"
        }
      }
    };
  const previewSlugs = {
      "Event": {
        slug: 'new-event',
      },
      "Article": { 
        slug: 'new-insights',
      },
      "News": {
        slug: 'new-news',
      },
      "Page": {
        slug: 'new-page',
      },
      "Practice Area": {
        slug: 'new-practice-area',
      }
    }
  
  /** COMMON FUNCTIONS **/
  function handleLocaleStr(localeStr){
    return localeStr === 'en-US' ? '' : `${localeStr}/`
  }
  function handleParentPath(localeStr, cT){
    return pageSlugs[localeStr][cT] ? `${pageSlugs[localeStr][cT].parentPath}/` : ''
  };

  const setPreviewButtonUrl = (url) => innerSpan.innerHTML = '<span id="innerSpan"><a target="_blank" href="'+url+'"><button id="previewEntry" class="cf-btn-primary">Preview Entry</button></a></span>';
  const setPreviewButtonDisabled = () => previewBtn.disabled = true;

  function disableOrEnableOptions(dropdown){
      let d2N = {
    'American English': 'en-US',
    'British English': 'en-GB',
    'Korean': 'ko',
    'Japanese': 'ja',
    'French': 'fr',
    'Chinese': 'zh',
    'German': 'de',
  };

  	let conditionArr = extension.entry.fields.displayOnSites && extension.entry.fields.displayOnSites._fieldLocales["en-US"]._value ? extension.entry.fields.displayOnSites._fieldLocales["en-US"]._value : ["American English"];
    conditionArr = conditionArr.map(loc => loc = d2N[loc]);
    const options = dropdown.getElementsByTagName("option")
    let firstSelectedOption = -1;
    let currentSelectedOption = dropdown.selectedIndex;
    let currentSelectedValue = options[currentSelectedOption].value
    
    for (let i = 0; i < options.length; i++){
      let option = options[i];
      if (conditionArr.includes(option.value) && firstSelectedOption === -1){
        option.disabled = false
        firstSelectedOption = i
      }
      else if (conditionArr.includes(option.value)) {
        option.disabled = false

      } else {
        option.disabled = true;
      }
    }
    
    dropdown.selectedIndex = conditionArr.includes(currentSelectedValue) ? currentSelectedOption : firstSelectedOption
  }
 
  
    const formatUrl = ({ baseUrl, id, slug, category, parentPath, locale}) => {
      let tempUrl = baseUrl;
      if (id){
        tempUrl =`${tempUrl}/${locale}${parentPath}${slug}?id=${id}`;    
      } else if (category){
        tempUrl =`${tempUrl}/${locale}${parentPath}${category}/${slug}`;    
      } else {
        tempUrl = `${tempUrl}/${locale}${parentPath}${slug}`; 
      }
      return tempUrl;
    }
    
    const formatUrlAndSetPreviewButton = ({baseUrl, id, slug, category, parentPath, locale}) => {
      const tempUrl = formatUrl({
        baseUrl: baseUrl,
        slug: slug,
        id: id,
        category: category,
        parentPath: parentPath,
        locale: locale
      })
      setPreviewButtonUrl(tempUrl)  
    }
    

    async function getArticleCategory(entryContentType, entrySlug) {
      try {
        let catId = extension.entry.fields.category._fieldLocales['en-US']._value.sys.id;
        const res = await extension.space.getEntry(catId)
        let catSlug = res.fields.slug[dropDown.value] || res.fields.slug['en-US']
        return catSlug;
      } catch (e) {
        console.error(e); // 💩
      }
    }
  

 		disableOrEnableOptions(localeDropdownMenu)

  /** CONSTANTS **/
  const { ids: { environment, entry: cId }, contentType: { name: contentType }, entry: { fields: entry} } = extension;
  
  
  const protocol = 'http://'
  const domainName = "paulhastings.com"
  const contentfulBranchNamesToCloudfrontDeployments = {
      "master": `${protocol}${domainName}`,
      "uat": `${protocol}${environment}.${domainName}`,
      "qa": `${protocol}${environment}.${domainName}`,
      "dev": `${protocol}${environment}.${domainName}`,
      "preview": `${protocol}preview.${domainName}`,
    };
  
  const branchName = 'preview';

  const isNewEntry = publishedState.publishedCounter === 0;
  
  const isArticle = contentType === 'Article';
  const isEvent = contentType === 'Event';
  const isNews = contentType === 'News';
  const isOffice = contentType === 'Office';
  const isPage = contentType === 'Page';
  const isPracticeArea = contentType === 'Practice Area';
  const isProfessional = contentType === 'Professional';
  
    const isHome = isPage && cId === '26vOlLRKnKxlflWMQLQnXS'
  const isInactiveProfessional = isProfessional && entry.active && (entry.active._fieldLocales['en-US']._value === false)
  
  const baseUrl = contentfulBranchNamesToCloudfrontDeployments[branchName];

  
   /** EXTENSION URL LOGIC BASED OFF ENTRY STATUS **/
  const handleUpdateSlug = () => {
    let isNewLocale = !(displayedLocales.includes(dropDown.value));
    let isChangedVersion = !isNewEntry && (publishedState.publishedVersion !== publishedState.version);
    let isNewLocalizedVersionNotPreviouslyDeployed = isNewLocale && isChangedVersion
 
   if (isNewEntry || isNewLocalizedVersionNotPreviouslyDeployed){
    const locale = handleLocaleStr(dropDown.value);
    const slug = previewSlugs[contentType].slug

    formatUrlAndSetPreviewButton({
      baseUrl: baseUrl,
      id: cId,
      slug: slug,
      locale: locale,
      parentPath: ''
    })
    
  } else if (isHome){
    const locale = handleLocaleStr(dropDown.value);
    const parentPath = handleParentPath(dropDown.value, contentType);
    let slug = entry.slug._fieldLocales[dropDown.value]._value ? entry.slug._fieldLocales[dropDown.value]._value : entry.slug._fieldLocales['en-US']._value
    formatUrlAndSetPreviewButton({
      baseUrl: baseUrl,
      slug: '',
      locale: locale,
      parentPath: parentPath
     });
    
  }else if (isInactiveProfessional) {
    setPreviewButtonDisabled()
  } else if (!isNewEntry && isArticle){
    const locale = handleLocaleStr(dropDown.value);
    const parentPath = handleParentPath(dropDown.value, contentType);
    let slug = entry.slug._fieldLocales[dropDown.value]._value || entry.slug._fieldLocales['en-US']._value;
    getArticleCategory(contentType, slug).then((cat) => {
      formatUrlAndSetPreviewButton({
        baseUrl: baseUrl,
        slug: slug,
        category: cat,
        locale: locale,
        parentPath: parentPath
     	});
    });
  } else if (isPracticeArea || isNews){
    const locale = handleLocaleStr(dropDown.value);
    const parentPath = handleParentPath(dropDown.value, contentType);
    let slug = entry.slug._fieldLocales['en-US']._value
    formatUrlAndSetPreviewButton({
      baseUrl: baseUrl,
      slug: slug,
      locale: locale,
      parentPath: parentPath
     });
  } else { 
    const locale = handleLocaleStr(dropDown.value);
    const parentPath = handleParentPath(dropDown.value, contentType);
    let slug = entry.slug._fieldLocales[dropDown.value]._value ? entry.slug._fieldLocales[dropDown.value]._value : entry.slug._fieldLocales['en-US']._value
    formatUrlAndSetPreviewButton({
      baseUrl: baseUrl,
      slug: slug,
      locale: locale,
      parentPath: parentPath
     });
  }
  }
   	handleUpdateSlug();

   function checkDisplayedLocalesAndUpdateSlug(localeDropdownMenu){
     disableOrEnableOptions(localeDropdownMenu)
     handleUpdateSlug()
   }
    function pollForUpdates(){
    if (pollingInterval){
      window.clearInterval(pollingInterval);
    }
    checkDisplayedLocalesAndUpdateSlug(localeDropdownMenu)
    pollingInterval = window.setInterval(checkDisplayedLocalesAndUpdateSlug, pollingFrequency,localeDropdownMenu)
    }
  
  
  /** CHECK FOR UPDATES TO DISPLAY LOCALES **/
  pollForUpdates()
 
  
}

window.contentfulExtension.init(function (extension) {
  let displayToNodeLocaleArr = {
    'American English': 'en-US',
    'British English': 'en-GB',
    'Korean': 'ko',
    'Japanese': 'ja',
    'French': 'fr',
    'Chinese': 'zh',
    'German': 'de',
  };
    extension.window.startAutoResizer()
  const publishedState = extension.entry.getSys()
  let displayedLocales = extension.entry.fields.displayOnSites && extension.entry.fields.displayOnSites._fieldLocales["en-US"]._value ? extension.entry.fields.displayOnSites._fieldLocales["en-US"]._value : ["American English"];
  displayedLocales = displayedLocales.map(loc => loc = displayToNodeLocaleArr[loc]);
  showExtension(extension, publishedState, displayedLocales);
});
  </script>
</body>

</html>