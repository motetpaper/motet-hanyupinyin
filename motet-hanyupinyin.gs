/**
 * hpt.gs
 * job    : Adds Hanyu Pinyin custom function to Google Sheets
 * git    : https://github.com/motetpaper/motet-hanyupinyin
 * lic    : MIT https://opensource.org/license/mit
 * version: 3.2
 * @OnlyCurrentDoc Limits the script to only accessing the current spreadsheet.
 */

const pnyn = {};

// pre-flight IIFE that caches data
(function(){
  // returns JSON data from data source, given ID
  function getdata(id) {
    const url = `https://motetpaper.github.io/${id}`;
    console.log(url);
    const headers = {
      'Cache-Control' : 'max-age=86400'
    };
    const response = UrlFetchApp.fetch(url, headers);
    const text = response.getContentText();
    return JSON.parse(text.trim());
  }

  pnyn.data = getdata('pnyn/hp.min.json');
})();



/**
 * Converts Chinese characters to Hanyu Pinyin with tone numbers.
 *
 * @param {string} text - Chinese character text or a range of text
 * @return {string} Hanyu Pinyin with tone numbers.
 * @customfunction
 */
function MOTET_HANYUPINYIN(text) {
  switch(typeof text){
      
    case 'string':
      return motet_hp_(text);

    case 'object':
      if(text instanceof Date) {
        return text;
      }

      if(text instanceof Array) {
        return text.map(MOTET_HANYUPINYIN);
      }

      return '';
  default:
    // pass-through input
    return text;
  }
}


/**
 * Helper functions
 */

// returns hanyu pinyin with tone numbers
function motet_hp_(text) {

  for(var h in pnyn.data) {
    text = text.replace((new RegExp(h, 'g')), ' ' + pnyn.data[h] + ' ');
  }

  text = motet_finish_(text);
  return text;
}

// returns cleaned up text after processing
function motet_finish_(str) {
  return str.replace((new RegExp('[^\\S\\n]{2,}', 'g')), ' ').trim();
}
