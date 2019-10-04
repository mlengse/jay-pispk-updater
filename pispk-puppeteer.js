const puppeteer = require('puppeteer');
const queryString = require('query-string');

const { 
  puppeteerCfg,
  navCfg,
  PISPK_USERNAME,
  PISPK_PASSWORD 
} = require('./config')

module.exports = class Pispk {
  constructor() {
    this.browser = null
    this.page = null
    this.loggedIn = false
    this.recordsTotal = 0
    this.recordsFiltered = 0
    this.postDataJson = null
  }

  async init(username = PISPK_USERNAME, password = PISPK_PASSWORD){
    this.browser = await puppeteer.launch(puppeteerCfg);
    const pages = await this.browser.pages()
    this.page = pages[0]
    // this.page = await this.browser.newPage()
    await this.page.goto('https://keluargasehat.kemkes.go.id/logout', navCfg);
    await this.page.goto('https://keluargasehat.kemkes.go.id', navCfg);
    await this.page.type('#username', username)
    await this.page.type('#password', password)
    await this.page.click('#forms-login > div.login-form-footer > button')
    await this.page.waitForNavigation(navCfg)
    this.loggedIn = true
  }
  
  async end() {
    await this.page.goto('https://keluargasehat.kemkes.go.id/logout', navCfg);

    await this.browser.close()
    this.browser = null
    this.page = null
    this.loggedIn = false
    this.browser = false
    this.recordsTotal = 0
    this.recordsFiltered = 0
    this.postDataJson = null
  }

  async prepareRTPage() {
    this.page.on('request', request => {
      if(request.url() === 'https://keluargasehat.kemkes.go.id/rumah_tangga/dt_rumah_tangga' && request.method() === 'POST') {
        this.postDataJson = queryString.parse(request.postData())
      }
    })

    this.page.on('response', async response => {
      if(response.url() === 'https://keluargasehat.kemkes.go.id/rumah_tangga/dt_rumah_tangga') {
        let json = await response.json()
        this.recordsTotal = json.recordsTotal
        this.recordsFiltered = json.recordsFiltered
        
        console.log('records total:' + this.recordsTotal)
        console.log('records filtered:' + this.recordsFiltered)
        console.log('data length:' + json.data.length)
          
      }

    })

    console.log('goto rumah tangga page')

    await this.page.goto('https://keluargasehat.kemkes.go.id/rumah_tangga', navCfg)
  }

  async getDataRumahTangga(){
    if(!this.loggedIn) {
      await this.init()
    }

    if(await this.page.url() !== 'https://keluargasehat.kemkes.go.id/rumah_tangga'){
      await this.prepareRTPage()
    }

    let postDataJson = Object.assign({}, this.postDataJson, {
      iDisplayLength: this.recordsTotal.toString()
    })

    return this.page.evaluate( aoData => {
      return new Promise( ( resolve ) => {
        $.ajax({
          'dataType': 'json',
          'type': 'POST',
          'url': 'https://keluargasehat.kemkes.go.id/rumah_tangga/dt_rumah_tangga',
          'data': aoData,
          'success': data => resolve(data),
          error: (jqXHR, textStatus, errorThrown) => resolve({jqXHR, textStatus, errorThrown})
        });
      })
    }, postDataJson)

  }

  async getIKSRT(surveiID) {
    if(!this.loggedIn) {
      await this.init()
    }

    return this.page.evaluate( surveiID => {
      return new Promise( (resolve) => {
        $.ajax({
          type: 'POST',
          dataType: 'json',
          url: 'https://keluargasehat.kemkes.go.id/rumah_tangga/view_iks',
          data: { survei_id: surveiID, table: 'iks_inti' },
          success: r => resolve(r),
          error: (jqXHR, textStatus, errorThrown) => resolve({jqXHR, textStatus, errorThrown})
          // success: function (r) {
          //   var html = '<div class="row">';
          //   html += '<div class="col-md-12">';
          //   html += '<table class="table table-bordered table-responsive table-striped table-hover">';
          //   html += '<tbody>';
          //   html += '<thead>';
          //   html += '<tr>';
          //   html += '<th>No</th>';
          //   html += '<th>Indikator</th>';
          //   html += '<th>Nilai</th>';
          //   html += '</tr>';
          //   html += '</thead>';
    
          //   $.each(r.indikator, function (i, v) {
          //     html += '<tr>';
          //     html += '<td>' + v.indikator_id + '</td>';
          //     html += '<td>' + v.indikator + '</td>';
          //     html += '<td>' + v.nilai + '</td>';
          //     html += '</tr>';
          //   });
    
          //   var kategori, warna, style, fwarna;
          //   if (r.iks > 0.800) {
          //     kategori = 'KELUARGA SEHAT';
          //     style = 'success';
          //     warna = '#2cf13b';
          //     fwarna = '#000000';
          //   } else if (r.iks >= 0.500 && r.iks <= 0.800) {
          //     kategori = 'KELUARGA PRA-SEHAT';
          //     style = 'warning';
          //     warna = '#fff705';
          //     fwarna = '#000000';
          //   } else {
          //     kategori = 'TIDAK SEHAT';
          //     style = 'danger';
          //     warna = '#f50202';
          //     fwarna = '#ffffff';
          //   }
    
          //   html += '<tr>';
          //   //html += '<td colspan="2">Indeks Keluarga Sehat = (&#931; Y) / (&#931; Y + &#931; T) * 100%<br/>' +
          //   //'('+ r.y +')/('+ r.y +' + '+ r.t +') * 100%</td>';
          //   html += '<td colspan="2">Indeks Keluarga Sehat = &#931; Y / (12 - &#931; N)<br/>' +
          //     + r.y + '/(12 - ' + r.n + ')</td>';
          //   //html += '<td class="'+ style +'">'+ r.iks +'%</td>';
          //   html += '<td style="background-color: ' + warna + '; color: ' + fwarna + '">' + r.iks + '</td>';
          //   html += '</tr>';
    
          //   //html += '<tr class="'+style+'">';
          //   html += '<tr style="background-color: ' + warna + '; color: ' + fwarna + '">';
          //   html += '<td colspan="3" class="td-center">' + kategori + '</td>';
          //   html += '</tr>';
          //   html += '</tbody>';
          //   html += '</table>';
          //   html += '</div>';
          //   html += '</div>';
    
          //   bootbox.dialog({
          //     title: 'IKS KELUARGA ' + label.toUpperCase() + ' - ' + r.kk,
          //     className: 'medium',
          //     message: html
          //   });
          // }
        });
    
      })
    }, surveiID)

  }

}