<template>
  <div class="register-wrap">
    <div class="register-cont">
      <div class="company-info">
        <div class="company-name">
          <img src="./assets/xpose_logo.png" alt="">
        </div>
        <div class="company-link">
          <div>
            <img src="./assets/rgbLink_logo.png" alt="">
          </div>
          <div>www.rgblink.com</div>
        </div>
      </div>
      <div class="register-info">
        <div class="header">
          <div :class="tabIndex == 0 ? 'show' : ''">注册</div>
          <div :class="tabIndex == 1 ? 'show' : ''">激活</div>
        </div>
        <div class="register-view" v-if="tabIndex == 0">
          <div class="register-data-item">
            <div class="label">
              <span>名字</span>
              <span class="need">*</span>
            </div>
            <input type="text" v-model="name">
          </div>
          <div class="register-data-item">
            <div class="label">
              <span>姓</span>
              <span class="need">*</span>
            </div>
            <input type="text" v-model="surname">
          </div>
          <div class="register-data-item">
            <div class="label">
              <span>邮箱</span>
              <span class="need">*</span>
            </div>
            <input type="text" v-model="email">
          </div>
          <div class="register-data-item">
            <div class="label">
              <span>公司</span>
            </div>
            <input type="text" v-model="company">
          </div>
          <div class="register-data-item">
            <div class="label">
              <span>国家</span>
              <span class="need">*</span>
            </div>
            <el-select v-model="country" placeholder="请选择">
              <el-option
                v-for="item in countryList"
                :key="item.index"
                :label="item.lanText"
                :value="item.index">
              </el-option>
            </el-select>
          </div>
          <div class="register-btn" @click="register">开始注册</div>
        </div>
        <div class="activate-view" v-if="tabIndex == 1">
          <div class="activate-tips">
            <div class="some-words">
              <div>感谢您的注册！</div>
              <div>您的注册码将通过电子邮箱提供。</div>
              <div>这台计算机没有网络连接？只需扫描右边的二维码。</div>
              <div>请检查您的{{email}}电子邮箱账户以获得注册码，并在下面输入激活。</div>
              <div>没有收到邮件？请检查您的垃圾邮件文件夹，或返回更正您的电子邮箱地址。</div>
            </div>
            <!-- <img src="" alt="二维码"> -->
            <div id="qrcode"></div>
          </div>
          <input type="text" v-model="activeCode" class="code-input">
          <div class="btns-view">
            <div class="show" @click="preEvent">上一步</div>
            <div :class="activeCode.length >= 8 ? 'show' : ''" @click="activateEvent">开始激活</div>
          </div>
        </div>
      </div>
      
      
    </div>
  </div>
</template>

<script>
import Api from '@/utils/api';
import QRCode from 'qrcodejs2'  // 引入qrcode
import utils from '@/utils/utils';
export default {
  data() {
    return {
      tabIndex: 0, // 处于注册||激活
      name: '',
      surname: '',
      email: '',
      company: '',
      activeCode: '', // 激活码
      mac: '',
      ip: '',
      countryList: [{
          lanText: "Afghanistan",
          countryShort: "AF",
          index: 0
        },
        {
          lanText: "Albania",
          countryShort: "AL",
          index: 1
        },
        {
          lanText: "Algeria",
          countryShort: "DZ",
          index: 2
        },
        {
          lanText: "American Samoa",
          countryShort: "AS",
          index: 3
        },
        {
          lanText: "Andorra",
          countryShort: "AD",
          index: 4
        },
        {
          lanText: "Angola",
          countryShort: "AO",
          index: 5
        },
        {
          lanText: "Anguilla",
          countryShort: "AI",
          index: 6
        },
        {
          lanText: "Antarctica",
          countryShort: "AQ",
          index: 7
        },
        {
          lanText: "Antigua and Barbuda",
          countryShort: "AG",
          index: 8
        },
        {
          lanText: "Argentina",
          countryShort: "AR",
          index: 9
        },
        {
          lanText: "Armenia",
          countryShort: "AM",
          index: 10
        },
        {
          lanText: "Aruba",
          countryShort: "AW",
          index: 11
        },
        {
          lanText: "Australia",
          countryShort: "AU",
          index: 12
        },
        {
          lanText: "Austria",
          countryShort: "AT",
          index: 13
        },
        {
          lanText: "Azerbaijan",
          countryShort: "AZ",
          index: 14
        },
        {
          lanText: "Bahamas",
          countryShort: "BS",
          index: 15
        },
        {
          lanText: "Bahrain",
          countryShort: "BH",
          index: 16
        },
        {
          lanText: "Bangladesh",
          countryShort: "BD",
          index: 17
        },
        {
          lanText: "Barbados",
          countryShort: "BB",
          index: 18
        },
        {
          lanText: "Belarus",
          countryShort: "BY",
          index: 19
        },
        {
          lanText: "Belgium",
          countryShort: "BE",
          index: 20
        },
        {
          lanText: "Belize",
          countryShort: "BZ",
          index: 21
        },
        {
          lanText: "Benin",
          countryShort: "BJ",
          index: 22
        },
        {
          lanText: "Bermuda",
          countryShort: "BM",
          index: 23
        },
        {
          lanText: "Bhutan",
          countryShort: "BT",
          index: 24
        },
        {
          lanText: "Bolivia",
          countryShort: "BO",
          index: 25
        },
        {
          lanText: "Bosnia and Herzegovina",
          countryShort: "BA",
          index: 26
        },
        {
          lanText: "Botswana",
          countryShort: "BW",
          index: 27
        },
        {
          lanText: "Brazil",
          countryShort: "BR",
          index: 28
        },
        {
          lanText: "British Virgin Islands",
          countryShort: "VG",
          index: 29
        },
        {
          lanText: "Brunei",
          countryShort: "BN",
          index: 30
        },
        {
          lanText: "Bulgaria",
          countryShort: "BG",
          index: 31
        },
        {
          lanText: "Burkina Faso",
          countryShort: "BF",
          index: 32
        },
        {
          lanText: "Burma(Myanmar",
          countryShort: "MM",
          index: 33
        },
        {
          lanText: "Burundi",
          countryShort: "BI",
          index: 34
        },
        {
          lanText: "Cambodia",
          countryShort: "KH",
          index: 35
        },
        {
          lanText: "Cameroon",
          countryShort: "CM",
          index: 36
        },
        {
          lanText: "Canada",
          countryShort: "CA",
          index: 37
        },
        {
          lanText: "Cape Verde",
          countryShort: "CV",
          index: 38
        },
        {
          lanText: "Cayman Islands",
          countryShort: "KY",
          index: 39
        },
        {
          lanText: "Central African Republic",
          countryShort: "CF",
          index: 40
        },
        {
          lanText: "Chad",
          countryShort: "TD",
          index: 41
        },
        {
          lanText: "Chile",
          countryShort: "CL",
          index: 42
        },
        {
          lanText: "China",
          countryShort: "CN",
          index: 43
        },
        {
          lanText: "Christmas Island",
          countryShort: "CX",
          index: 44
        },
        {
          lanText: "Cocos(Keeling) Islands",
          countryShort: "CC",
          index: 45
        },
        {
          lanText: "Colombia",
          countryShort: "CO",
          index: 46
        },
        {
          lanText: "Comoros",
          countryShort: "KM",
          index: 47
        },
        {
          lanText: "Cook Islands",
          countryShort: "CK",
          index: 48
        },
        {
          lanText: "Costa Rica",
          countryShort: "CR",
          index: 49
        },
        {
          lanText: "Croatia",
          countryShort: "HR",
          index: 50
        },
        {
          lanText: "Cuba",
          countryShort: "CU",
          index: 51
        },
        {
          lanText: "Cyprus",
          countryShort: "CY",
          index: 52
        },
        {
          lanText: "Czech Republic",
          countryShort: "CZ",
          index: 53
        },
        {
          lanText: "Democratic Republic of the Congo",
          countryShort: "CD",
          index: 54
        },
        {
          lanText: "Denmark",
          countryShort: "DK",
          index: 55
        },
        {
          lanText: "Djibouti",
          countryShort: "DJ",
          index: 56
        },
        {
          lanText: "Dominica",
          countryShort: "DM",
          index: 57
        },
        {
          lanText: "Dominican Republic",
          countryShort: "DO",
          index: 58
        },
        {
          lanText: "East Timor",
          countryShort: "TL",
          index: 59
        },
        {
          lanText: "Ecuador",
          countryShort: "EC",
          index: 60
        },
        {
          lanText: "Egypt",
          countryShort: "EG",
          index: 61
        },
        {
          lanText: "El Salvador",
          countryShort: "SV",
          index: 62
        },
        {
          lanText: "Equatorial Guinea",
          countryShort: "GQ",
          index: 63
        },
        {
          lanText: "Eritrea",
          countryShort: "ER",
          index: 64
        },
        {
          lanText: "Estonia",
          countryShort: "EE",
          index: 65
        },
        {
          lanText: "Ethiopia",
          countryShort: "ET",
          index: 66
        },
        {
          lanText: "Falkland Islands",
          countryShort: "FK",
          index: 67
        },
        {
          lanText: "Faroe Islands",
          countryShort: "FO",
          index: 68
        },
        {
          lanText: "Fiji",
          countryShort: "FJ",
          index: 69
        },
        {
          lanText: "Finland",
          countryShort: "FI",
          index: 70
        },
        {
          lanText: "France",
          countryShort: "FR",
          index: 71
        },
        {
          lanText: "French Polynesia",
          countryShort: "PF",
          index: 72
        },
        {
          lanText: "Gabon",
          countryShort: "GA",
          index: 73
        },
        {
          lanText: "Gambia",
          countryShort: "GM",
          index: 74
        },
        {
          lanText: "Georgia",
          countryShort: "GE",
          index: 75
        },
        {
          lanText: "Germany",
          countryShort: "DE",
          index: 76
        },
        {
          lanText: "Ghana",
          countryShort: "GH",
          index: 77
        },
        {
          lanText: "Gibraltar",
          countryShort: "GI",
          index: 78
        },
        {
          lanText: "Greece",
          countryShort: "GR",
          index: 79
        },
        {
          lanText: "Greenland",
          countryShort: "GL",
          index: 80
        },
        {
          lanText: "Grenada",
          countryShort: "GD",
          index: 81
        },
        {
          lanText: "Guam",
          countryShort: "GU",
          index: 82
        },
        {
          lanText: "Guatemala",
          countryShort: "GP",
          index: 83
        },
        {
          lanText: "Guinea",
          countryShort: "GN",
          index: 84
        },
        {
          lanText: "Guinea-Bissau",
          countryShort: "GW",
          index: 85
        },
        {
          lanText: "Guyana",
          countryShort: "GY",
          index: 86
        },
        {
          lanText: "Haiti",
          countryShort: "HT",
          index: 87
        },
        {
          lanText: "Holy See(Vatican City)",
          countryShort: "VA",
          index: 88
        },
        {
          lanText: "Honduras",
          countryShort: "HN",
          index: 89
        },
        {
          lanText: "Hong Kong(China)",
          countryShort: "HK",
          index: 90
        },
        {
          lanText: "Hungary",
          countryShort: "HU",
          index: 91
        },
        {
          lanText: "Iceland",
          countryShort: "IS",
          index: 92
        },
        {
          lanText: "India",
          countryShort: "IN",
          index: 93
        },
        {
          lanText: "Indonesia",
          countryShort: "ID",
          index: 94
        },
        {
          lanText: "Iran",
          countryShort: "IR",
          index: 95
        },
        {
          lanText: "Iraq",
          countryShort: "IQ",
          index: 96
        },
        {
          lanText: "Ireland",
          countryShort: "IE",
          index: 97
        },
        {
          lanText: "Isle of Man",
          countryShort: "IM",
          index: 98
        },
        {
          lanText: "Israel",
          countryShort: "IL",
          index: 99
        },
        {
          lanText: "Italy",
          countryShort: "IT",
          index: 100
        },
        {
          lanText: "Ivory Coast",
          countryShort: "CI",
          index: 101
        },
        {
          lanText: "Jamaica",
          countryShort: "JM",
          index: 102
        },
        {
          lanText: "Japan",
          countryShort: "JP",
          index: 103
        },
        {
          lanText: "Jordan",
          countryShort: "JO",
          index: 104
        },
        {
          lanText: "Kazakhstan",
          countryShort: "KZ",
          index: 105
        },
        {
          lanText: "Kenya",
          countryShort: "KE",
          index: 106
        },
        {
          lanText: "Kiribati",
          countryShort: "KI",
          index: 107
        },
        {
          lanText: "Kosovo",
          countryShort: "KV",
          index: 108
        },
        {
          lanText: "Kuwait",
          countryShort: "KW",
          index: 109
        },
        {
          lanText: "Kyrgyzstan",
          countryShort: "KG",
          index: 110
        },
        {
          lanText: "Laos",
          countryShort: "LA",
          index: 111
        },
        {
          lanText: "Latvia",
          countryShort: "LV",
          index: 112
        },
        {
          lanText: "Lebanon",
          countryShort: "LB",
          index: 113
        },
        {
          lanText: "Lesotho",
          countryShort: "LS",
          index: 114
        },
        {
          lanText: "Liberia",
          countryShort: "LR",
          index: 115
        },
        {
          lanText: "Libya",
          countryShort: "LY",
          index: 116
        },
        {
          lanText: "Liechtenstein",
          countryShort: "LI",
          index: 117
        },
        {
          lanText: "Lithuania",
          countryShort: "LT",
          index: 118
        },
        {
          lanText: "Luxembourg",
          countryShort: "LU",
          index: 119
        },
        {
          lanText: "Macau(China)",
          countryShort: "MO",
          index: 120
        },
        {
          lanText: "Macedonia",
          countryShort: "MK",
          index: 121
        },
        {
          lanText: "Madagascar",
          countryShort: "MG",
          index: 122
        },
        {
          lanText: "Malawi",
          countryShort: "MW",
          index: 123
        },
        {
          lanText: "Malaysia",
          countryShort: "MY",
          index: 124
        },
        {
          lanText: "Maldives",
          countryShort: "MV",
          index: 125
        },
        {
          lanText: "Mali",
          countryShort: "ML",
          index: 126
        },
        {
          lanText: "Malta",
          countryShort: "MT",
          index: 127
        },
        {
          lanText: "Marshall Islands",
          countryShort: "MH",
          index: 128
        },
        {
          lanText: "Mauritania",
          countryShort: "MR",
          index: 129
        },
        {
          lanText: "Mauritius",
          countryShort: "MU",
          index: 130
        },
        {
          lanText: "Mayotte",
          countryShort: "YT",
          index: 131
        },
        {
          lanText: "Mexico",
          countryShort: "MX",
          index: 132
        },
        {
          lanText: "Micronesia",
          countryShort: "FM",
          index: 133
        },
        {
          lanText: "Moldova",
          countryShort: "MD",
          index: 134
        },
        {
          lanText: "Monaco",
          countryShort: "MC",
          index: 135
        },
        {
          lanText: "Mongolia",
          countryShort: "MN",
          index: 136
        },
        {
          lanText: "Montenegro",
          countryShort: "ME",
          index: 137
        },
        {
          lanText: "Montserrat",
          countryShort: "MS",
          index: 138
        },
        {
          lanText: "Morocco",
          countryShort: "MA",
          index: 139
        },
        {
          lanText: "Mozambique",
          countryShort: "MZ",
          index: 140
        },
        {
          lanText: "Namibia",
          countryShort: "NA",
          index: 141
        },
        {
          lanText: "Nauru",
          countryShort: "NR",
          index: 142
        },
        {
          lanText: "Nepal",
          countryShort: "NP",
          index: 143
        },
        {
          lanText: "Netherlands",
          countryShort: "NL",
          index: 144
        },
        {
          lanText: "Netherlands Antilles",
          countryShort: "AN",
          index: 145
        },
        {
          lanText: "New Caledonia",
          countryShort: "NC",
          index: 146
        },
        {
          lanText: "New Zealand",
          countryShort: "NZ",
          index: 147
        },
        {
          lanText: "Nicaragua",
          countryShort: "NI",
          index: 148
        },
        {
          lanText: "Niger",
          countryShort: "NE",
          index: 149
        },
        {
          lanText: "Nigeria",
          countryShort: "NG",
          index: 150
        },
        {
          lanText: "Niue",
          countryShort: "NU",
          index: 151
        },
        {
          lanText: "Norfolk Island",
          countryShort: "NF",
          index: 152
        },
        {
          lanText: "North Korea",
          countryShort: "KP",
          index: 153
        },
        {
          lanText: "Northern Mariana Islands",
          countryShort: "MP",
          index: 154
        },
        {
          lanText: "Norway",
          countryShort: "NO",
          index: 155
        },
        {
          lanText: "Oman",
          countryShort: "OM",
          index: 156
        },
        {
          lanText: "Pakistan",
          countryShort: "PK",
          index: 157
        },
        {
          lanText: "Palau",
          countryShort: "PW",
          index: 158
        },
        {
          lanText: "Panama",
          countryShort: "PA",
          index: 159
        },
        {
          lanText: "Papua New Guinea",
          countryShort: "PG",
          index: 160
        },
        {
          lanText: "Paraguay",
          countryShort: "PY",
          index: 161
        },
        {
          lanText: "Peru",
          countryShort: "PE",
          index: 162
        },
        {
          lanText: "Philippines",
          countryShort: "PH",
          index: 163
        },
        {
          lanText: "Pitcairn Islands",
          countryShort: "PN",
          index: 164
        },
        {
          lanText: "Poland",
          countryShort: "PL",
          index: 165
        },
        {
          lanText: "Portugal",
          countryShort: "PT",
          index: 166
        },
        {
          lanText: "Puerto Rico",
          countryShort: "PR",
          index: 167
        },
        {
          lanText: "Qatar",
          countryShort: "QA",
          index: 168
        },
        {
          lanText: "Republic of the Congo",
          countryShort: "CG",
          index: 169
        },
        {
          lanText: "Romania",
          countryShort: "RO",
          index: 170
        },
        {
          lanText: "Russia",
          countryShort: "RU",
          index: 171
        },
        {
          lanText: "Rwanda",
          countryShort: "RW",
          index: 172
        },
        {
          lanText: "Saint Barthelemy",
          countryShort: "BL",
          index: 173
        },
        {
          lanText: "Saint Helena",
          countryShort: "SH",
          index: 174
        },
        {
          lanText: "Saint Kitts and Nevis",
          countryShort: "KN",
          index: 175
        },
        {
          lanText: "Saint Lucia",
          countryShort: "LC",
          index: 176
        },
        {
          lanText: "Saint Martin",
          countryShort: "MF",
          index: 177
        },
        {
          lanText: "Saint Pierre and Miquelon",
          countryShort: "PM",
          index: 178
        },
        {
          lanText: "Saint Vincent and the Grenadines",
          countryShort: "VC",
          index: 179
        },
        {
          lanText: "Samoa",
          countryShort: "WS",
          index: 180
        },
        {
          lanText: "San Marino",
          countryShort: "SM",
          index: 181
        },
        {
          lanText: "Sao Tome and Principe",
          countryShort: "ST",
          index: 182
        },
        {
          lanText: "Saudi Arabia",
          countryShort: "SA",
          index: 183
        },
        {
          lanText: "Senegal",
          countryShort: "SN",
          index: 184
        },
        {
          lanText: "Serbia",
          countryShort: "RS",
          index: 185
        },
        {
          lanText: "Seychelles",
          countryShort: "SC",
          index: 186
        },
        {
          lanText: "Sierra Leone",
          countryShort: "SL",
          index: 187
        },
        {
          lanText: "Singapore",
          countryShort: "SG",
          index: 188
        },
        {
          lanText: "Slovakia",
          countryShort: "SK",
          index: 189
        },
        {
          lanText: "Slovenia",
          countryShort: "SI",
          index: 190
        },
        {
          lanText: "Solomon Islands",
          countryShort: "SB",
          index: 191
        },
        {
          lanText: "Somalia",
          countryShort: "SO",
          index: 192
        },
        {
          lanText: "South Africa",
          countryShort: "ZA",
          index: 193
        },
        {
          lanText: "South Korea",
          countryShort: "KR",
          index: 194
        },
        {
          lanText: "Spain",
          countryShort: "ES",
          index: 195
        },
        {
          lanText: "Sri Lanka",
          countryShort: "LK",
          index: 196
        },
        {
          lanText: "Sudan",
          countryShort: "SD",
          index: 197
        },
        {
          lanText: "Suriname",
          countryShort: "SR",
          index: 198
        },
        {
          lanText: "Swaziland",
          countryShort: "SZ",
          index: 199
        },
        {
          lanText: "Sweden",
          countryShort: "SE",
          index: 200
        },
        {
          lanText: "Switzerland",
          countryShort: "CH",
          index: 201
        },
        {
          lanText: "Syria",
          countryShort: "SY",
          index: 202
        },
        {
          lanText: "Taiwan(China)",
          countryShort: "TW",
          index: 203
        },
        {
          lanText: "Tajikistan",
          countryShort: "TJ",
          index: 204
        },
        {
          lanText: "Tanzania",
          countryShort: "TZ",
          index: 205
        },
        {
          lanText: "Thailand",
          countryShort: "TH",
          index: 206
        },
        {
          lanText: "Togo",
          countryShort: "TG",
          index: 207
        },
        {
          lanText: "Tokelau",
          countryShort: "TK",
          index: 208
        },
        {
          lanText: "Tonga",
          countryShort: "TO",
          index: 209
        },
        {
          lanText: "Trinidad and Tobago",
          countryShort: "TT",
          index: 210
        },
        {
          lanText: "Tunisia",
          countryShort: "TN",
          index: 211
        },
        {
          lanText: "Turkey",
          countryShort: "TR",
          index: 212
        },
        {
          lanText: "Turkmenistan",
          countryShort: "TM",
          index: 213
        },
        {
          lanText: "Turks and Caicos Islands",
          countryShort: "TC",
          index: 214
        },
        {
          lanText: "Tuvalu",
          countryShort: "TV",
          index: 215
        },
        {
          lanText: "Uganda",
          countryShort: "UG",
          index: 216
        },
        {
          lanText: "Ukraine",
          countryShort: "UA",
          index: 217
        },
        {
          lanText: "United Arab Emirates",
          countryShort: "AE",
          index: 218
        },
        {
          lanText: "United Kingdom",
          countryShort: "GB",
          index: 219
        },
        {
          lanText: "United States",
          countryShort: "US",
          index: 220
        },
        {
          lanText: "Uruguay",
          countryShort: "UY",
          index: 221
        },
        {
          lanText: "US Virgin Islands",
          countryShort: "VI",
          index: 222
        },
        {
          lanText: "Uzbekistan",
          countryShort: "UZ",
          index: 223
        },
        {
          lanText: "Vanuatu",
          countryShort: "VU",
          index: 224
        },
        {
          lanText: "Venezuela",
          countryShort: "VE",
          index: 225
        },
        {
          lanText: "Vietnam",
          countryShort: "VN",
          index: 226
        },
        {
          lanText: "Wallis and Futuna",
          countryShort: "WF",
          index: 227
        },
        {
          lanText: "Yemen",
          countryShort: "YE",
          index: 228
        },
        {
          lanText: "Zambia",
          countryShort: "ZM",
          index: 229
        },
        {
          lanText: "Zimbabwe",
          countryShort: "ZW",
          index: 230
        }],
      country: '' // 所选国家
    }
  },
  created() {},
  mounted() {
    // 获取mac,ip信息
    Api.getMacAddress().then(res => {
      if(res.code == 200) {
        this.mac = res.data.mac;
        this.id = res.data.id;
        window.sessionStorage.setItem("ip", JSON.stringify(res.data.ip));
      } else {
        this.$message.error(res.message);
      }
    });
  },
  methods: {
    // 开始注册
    register() {
      // this.$router.push({name: 'Login'});
      // return;
      if (!this.name) {
        this.$message.error('名字不能为空');
        return;
      } 
      if (!this.surname) {
        this.$message.error('姓不能为空');
        return;
      }
      if (!this.email) {
        this.$message.error('邮箱不能为空');
        return;
      } else {
        const reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
        if(!reg.test(this.email)) {
          this.$message.error('邮箱格式错误');
        return;
        }
      }
      if (!this.country) {
        this.$message.error('国家不能为空');
        return;
      }
      const params = "&ma=" + this.mac +
                  "&fn=" + this.surname +
                  "&ln=" + this.name +
                  "&em=" + this.email +
                  "&co=" + this.company +
                  "&cn=" + this.countryList[this.country].countryShort +
                  "&ve=" + '1.0.0.0' +
                  "&bt=" + 'tt' +
                  "&os=" + this.getOsInfo().version +
                  "&ov=" + this.conversionText(this.getOsInfo().version) +
                  "&lg=" + 'CN';
      const winUrl = "https://xposereg.azurewebsites.net/api/HttpTrigger1?code=FlRdEIt/W/RdLniu/rVhKA70YqOjlVLn6fPdlwSbb2VHav1u/ld3MA=="+params;      
      const imgUrl = 'https://xposereg.azurewebsites.net/api/HttpTrigger-QR?code=capture' + params;
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", winUrl, true);
      xmlhttp.send();
      this.tabIndex = 1;
      this.$nextTick(() => {
        this.qrcode(imgUrl);
      })
    },
    // 上一步
    preEvent() {
      this.tabIndex = 0;
      this.activeCode = '';
    },
    // 开始激活
    activateEvent() {
      const data = {
        firstName: this.surname,
        lastName: this.name,
        email: this.email,
        company: this.company,
        country: this.countryList[this.country].lanText,
        key: this.activeCode
      }
      Api.accountActivate(data).then(res => {
        if(res.code == 200) {
          sessionStorage.setItem("account",JSON.stringify(res.data.account));
          sessionStorage.setItem("passwd",JSON.stringify(res.data.passwd));
          this.$router.push({
            name: 'Login',
            params: {
              account: res.data.account,
              passwd: res.data.passwd,
            }
          });
        }
      })
    },

    // 生成二维码
    qrcode(imgUrl) {
      let qrcode = new QRCode('qrcode', {
        width: 132,  
        height: 132,
        text: imgUrl, // 二维码地址
      })
    },
    
    // 获取操作系统信息 
    getOsInfo() {
      var userAgent = navigator.userAgent.toLowerCase();
      var name = 'Unknown';
      var version = 'Unknown';
      if (userAgent.indexOf('win') > -1) {
        name = 'Windows';
        if (userAgent.indexOf('windows nt 5.0') > -1) {
          version = 'Windows 2000';
        } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
          version = 'Windows XP';
        } else if (userAgent.indexOf('windows nt 6.0') > -1) {
          version = 'Windows Vista';
        } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
          version = 'Windows 7';
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
          version = 'Windows 8';
        } else if (userAgent.indexOf('windows nt 6.3') > -1) {
          version = 'Windows 8.1';
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
          version = 'Windows 10';
        } else {
          version = 'Unknown';
        }
      } else if (userAgent.indexOf('iphone') > -1) {
        name = 'Iphone';
      } else if (userAgent.indexOf('mac') > -1) {
        name = 'Mac';
      } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
        name = 'Unix';
      } else if (userAgent.indexOf('linux') > -1) {
        if (userAgent.indexOf('android') > -1) {
          name = 'Android';
        } else {
          name = 'Linux';
        }
      } else {
        name = 'Unknown';
      }
      return { name, version };
    },
    // 系统版本号
    conversionText (text) {
      switch (text) {
        case 'Amazon Linux AMI 2016.09' :
          return '2016.09';
          break;
        case 'Android Nougat' :
          return '7.1';
          break;
        case 'Fedora 25' :
          return '25';
          break;
        case 'iOS 10.1' :
          return '10.1';
          break;
        case 'macOS Sierra' :
          return '10.12';
          break;
        case 'tvOS 10' :
          return '10.0';
          break;
        case 'Ubuntu 16.10' :
          return '16.10';
          break;
        case 'watchOS 3.1' :
          return '3.1';
          break;
        case 'Windows 7 Service Pack 1' :
          return '7 SP 1';
          break;
        case 'Windows 8.1' :
          return '8.1';
          break;
        case 'Windows 10' :
          return '10';
          break;
        case 'Windows Server 2016' :
          return 'Server 2016';
          break;
      }
    }
  }
}
</script>

<style scoped lang='less'>
  .register-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    .register-cont {
      display: flex;
      width: 640px;
      height: 420px;
      padding: 32px 64px;
      background: rgb(18,24,36);
      .company-info {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0 24px;
        .company-name {
          color: #fff;
          font-size: 24px;
          font-weight: bold;
          img {
            display: block;
            width: 140px;
            height: 60px;
          }
        }
        .company-link {
          color: #fff;
          font-size: 12px;
          img {
            display: block;
            width: 100px;
            height: 20px;
            margin-bottom: 8px;
          }
        }
      }
      .register-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        background: rgb(43,48,66);
        .header {
          height: 42px;
          display: flex;
          div {
            flex: 1;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            background: rgb(24,30,44);
            font-size: 18px;
          }
          .show {
            position: relative;
            background: rgb(43,48,66);
            color: rgb(26,188,156);
          }
          .show::after {
            display: block;
            content: "";
            position: absolute;
            height: 2px;
            top: 0;
            width: 100%;
            background: rgb(26,188,156);
          }
        }
        .register-view {
          flex: 1;
          padding: 20px 64px 0;
          .register-data-item {
            display: flex;
            align-items: center;
            height: 42px;
            margin-bottom: 12px;
            background: #fff;
            padding: 0 12px;
            border-radius: 6px;
            .label {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 25%;
              margin-right: 12px;
              .need {
                padding-top: 6px;
                color: red;
              }
            }
            input {
              flex: 1;
              height: 100%;
              border: none;
              outline: none;
              appearance: none;
              padding: 0;
            }
            /deep/ .el-input__inner {
              border: none;
            }
          }
          .register-btn {
            height: 42px;
            margin-top: 32px;
            background: rgb(26,188,156);
            line-height: 42px;
            border-radius: 6px;
            text-align: center;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
          }
        }
        .activate-view {
          padding: 36px 36px 0;
          background: rgb(43,48,66);
          .activate-tips {
            display: flex;
            align-items: center;
            .some-words {
              flex: 1;
              text-align: left;
              margin-right: 16px;
              color: #fff;
              font-size: 14px;
              div {
                margin-bottom: 12px;
              }
            }
            img {
              display: block;
              width: 120px;
              height: 120px;
            }
          }
          .code-input {
            display: block;
            width: 80%;
            height: 36px;
            margin: 12px auto 0;
            border-radius: 6px;
            border: none;
            outline: none;
            appearance: none;
            text-indent: 2em;
          }
          .btns-view {
            width: 80%;
            display: flex;
            margin: 20px auto 0;
            justify-content: space-between;
            div {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 45%;
              height: 42px;
              background: rgb(140,140,140);
              border-radius: 6px;
              color: #fff;
              cursor: pointer;
            }
            .show {
              background: rgb(26,188,156);
            }
          }
        }
      }
    }
  }
</style>,
