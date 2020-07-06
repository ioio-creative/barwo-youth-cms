import { formatDateTimeString } from 'utils/datetime';
import generalResponseTypes from 'types/responses/general';

function GlobalConstants() {
  this.latestShow_tc = '最新劇目';
  this.latestShow_sc = '最新剧目';
  this.latestShow_en = 'Latest Show';

  this.scheduleOfShow_tc = '年度演期表';
  this.scheduleOfShow_sc = '年度演期表';
  this.scheduleOfShow_en = 'Schedule Of Show';

  this.artDirector_tc = '藝術總監';
  this.artDirector_sc = '艺术总监';
  this.artDirector_en = 'Art Director';

  this.actor_tc = '演員';
  this.actor_sc = '演员';
  this.actor_en = 'Actor';

  this.detailsOfShow_tc = '劇目詳情';
  this.detailsOfShow_sc = '剧目详情';
  this.detailsOfShow_en = 'Details Of Show';

  this.show_tc = '演期';
  this.show_sc = '演期';
  this.show_en = 'Show';

  this.allShow_tc = '全部演出';
  this.allShow_sc = '全部演出';
  this.allShow_en = 'All Show';

  this.activities_tc = '推介活動';
  this.activities_sc = '推介活动';
  this.activities_en = 'Activities';

  this.downloadPDF_tc = '下載劇目PDF';
  this.downloadPDF_sc = '下载剧目PDF';
  this.downloadPDF_en = 'Download PDF';

  this.ourActors_tc = '我們的新秀';
  this.ourActors_sc = '我们的新秀';
  this.ourActors_en = 'Our Actors';

  this.ymtTheater_tc = '油麻地戲院';
  this.ymtTheater_sc = '油麻地戏院';
  this.ymtTheater_en = 'YMT Theater';

  this.followUs_tc = '追蹤我們';
  this.followUs_sc = '追踪我们';
  this.followUs_en = 'Follow Us';

  this.all_tc = '全部';
  this.all_sc = '全部';
  this.all_en = 'All';

  this.boy_tc = '小生';
  this.boy_sc = '小生';
  this.boy_en = 'Boy';

  this.girl_tc = '花旦';
  this.girl_sc = '花旦';
  this.girl_en = 'Girl';

  this.inherit_tc = '承傳粵劇、振興道統';
  this.inherit_sc = '承传粤剧、振兴道统';
  this.inherit_en = 'Inherit';
  this.lastModifyDTDisplay = null;
  this.lastModifyUserDisplay = null;
}

/* statics */

GlobalConstants.globalConstantsResponseTypes = {
  // input validation

  LATESTSHOW_TC_REQUIRED: {
    type: 'LATESTSHOW_TC_REQUIRED',
    msg: 'LATESTSHOW_TC_REQUIRED'
  },
  LATESTSHOW_SC_REQUIRED: {
    type: 'LATESTSHOW_SC_REQUIRED',
    msg: 'LATESTSHOW_SC_REQUIRED'
  },
  LATESTSHOW_EN_REQUIRED: {
    type: 'LATESTSHOW_EN_REQUIRED',
    msg: 'LATESTSHOW_EN_REQUIRED'
  },

  SCHEDULEOFSHOW_TC_REQUIRED: {
    type: 'SCHEDULEOFSHOW_TC_REQUIRED',
    msg: 'SCHEDULEOFSHOW_TC_REQUIRED'
  },
  SCHEDULEOFSHOW_SC_REQUIRED: {
    type: 'SCHEDULEOFSHOW_SC_REQUIRED',
    msg: 'SCHEDULEOFSHOW_SC_REQUIRED'
  },
  SCHEDULEOFSHOW_EN_REQUIRED: {
    type: 'SCHEDULEOFSHOW_EN_REQUIRED',
    msg: 'SCHEDULEOFSHOW_EN_REQUIRED'
  },

  ARTDIRECTOR_TC_REQUIRED: {
    type: 'ARTDIRECTOR_TC_REQUIRED',
    msg: 'ARTDIRECTOR_TC_REQUIRED'
  },
  ARTDIRECTOR_SC_REQUIRED: {
    type: 'ARTDIRECTOR_SC_REQUIRED',
    msg: 'ARTDIRECTOR_SC_REQUIRED'
  },
  ARTDIRECTOR_EN_REQUIRED: {
    type: 'ARTDIRECTOR_EN_REQUIRED',
    msg: 'ARTDIRECTOR_EN_REQUIRED'
  },

  ACTOR_TC_REQUIRED: {
    type: 'ACTOR_TC_REQUIRED',
    msg: 'ACTOR_TC_REQUIRED'
  },
  ACTOR_SC_REQUIRED: {
    type: 'ACTOR_SC_REQUIRED',
    msg: 'ACTOR_SC_REQUIRED'
  },
  ACTOR_EN_REQUIRED: {
    type: 'ACTOR_EN_REQUIRED',
    msg: 'ACTOR_EN_REQUIRED'
  },

  DETAILSOFSHOW_TC_REQUIRED: {
    type: 'DETAILSOFSHOW_TC_REQUIRED',
    msg: 'DETAILSOFSHOW_TC_REQUIRED'
  },
  DETAILSOFSHOW_SC_REQUIRED: {
    type: 'DETAILSOFSHOW_SC_REQUIRED',
    msg: 'DETAILSOFSHOW_SC_REQUIRED'
  },
  DETAILSOFSHOW_EN_REQUIRED: {
    type: 'DETAILSOFSHOW_EN_REQUIRED',
    msg: 'DETAILSOFSHOW_EN_REQUIRED'
  },

  SHOW_TC_REQUIRED: {
    type: 'SHOW_TC_REQUIRED',
    msg: 'SHOW_TC_REQUIRED'
  },
  SHOW_SC_REQUIRED: {
    type: 'SHOW_SC_REQUIRED',
    msg: 'SHOW_SC_REQUIRED'
  },
  SHOW_EN_REQUIRED: {
    type: 'SHOW_EN_REQUIRED',
    msg: 'SHOW_EN_REQUIRED'
  },

  ALLSHOW_TC_REQUIRED: {
    type: 'ALLSHOW_TC_REQUIRED',
    msg: 'ALLSHOW_TC_REQUIRED'
  },
  ALLSHOW_SC_REQUIRED: {
    type: 'ALLSHOW_SC_REQUIRED',
    msg: 'ALLSHOW_SC_REQUIRED'
  },
  ALLSHOW_EN_REQUIRED: {
    type: 'ALLSHOW_EN_REQUIRED',
    msg: 'ALLSHOW_EN_REQUIRED'
  },

  ACTIVITIES_TC_REQUIRED: {
    type: 'ACTIVITIES_TC_REQUIRED',
    msg: 'ACTIVITIES_TC_REQUIRED'
  },
  ACTIVITIES_SC_REQUIRED: {
    type: 'ACTIVITIES_SC_REQUIRED',
    msg: 'ACTIVITIES_SC_REQUIRED'
  },
  ACTIVITIES_EN_REQUIRED: {
    type: 'ACTIVITIES_EN_REQUIRED',
    msg: 'ACTIVITIES_EN_REQUIRED'
  },

  DOWNLOADPDF_TC_REQUIRED: {
    type: 'DOWNLOADPDF_TC_REQUIRED',
    msg: 'DOWNLOADPDF_TC_REQUIRED'
  },
  DOWNLOADPDF_SC_REQUIRED: {
    type: 'DOWNLOADPDF_SC_REQUIRED',
    msg: 'DOWNLOADPDF_SC_REQUIRED'
  },
  DOWNLOADPDF_EN_REQUIRED: {
    type: 'DOWNLOADPDF_EN_REQUIRED',
    msg: 'DOWNLOADPDF_EN_REQUIRED'
  },

  YMTTHEATER_TC_REQUIRED: {
    type: 'YMTTHEATER_TC_REQUIRED',
    msg: 'YMTTHEATER_TC_REQUIRED'
  },
  YMTTHEATER_SC_REQUIRED: {
    type: 'YMTTHEATER_SC_REQUIRED',
    msg: 'YMTTHEATER_SC_REQUIRED'
  },
  YMTTHEATER_EN_REQUIRED: {
    type: 'YMTTHEATER_EN_REQUIRED',
    msg: 'YMTTHEATER_EN_REQUIRED'
  },

  FOLLOWUS_TC_REQUIRED: {
    type: 'FOLLOWUS_TC_REQUIRED',
    msg: 'FOLLOWUS_TC_REQUIRED'
  },
  FOLLOWUS_SC_REQUIRED: {
    type: 'FOLLOWUS_SC_REQUIRED',
    msg: 'FOLLOWUS_SC_REQUIRED'
  },
  FOLLOWUS_EN_REQUIRED: {
    type: 'FOLLOWUS_EN_REQUIRED',
    msg: 'FOLLOWUS_EN_REQUIRED'
  },

  ALL_TC_REQUIRED: {
    type: 'ALL_TC_REQUIRED',
    msg: 'ALL_TC_REQUIRED'
  },
  ALL_SC_REQUIRED: {
    type: 'ALL_SC_REQUIRED',
    msg: 'ALL_SC_REQUIRED'
  },
  ALL_EN_REQUIRED: {
    type: 'ALL_EN_REQUIRED',
    msg: 'ALL_EN_REQUIRED'
  },

  BOY_TC_REQUIRED: {
    type: 'BOY_TC_REQUIRED',
    msg: 'BOY_TC_REQUIRED'
  },
  BOY_SC_REQUIRED: {
    type: 'BOY_SC_REQUIRED',
    msg: 'BOY_SC_REQUIRED'
  },
  BOY_EN_REQUIRED: {
    type: 'BOY_EN_REQUIRED',
    msg: 'BOY_EN_REQUIRED'
  },

  GIRL_TC_REQUIRED: {
    type: 'GIRL_TC_REQUIRED',
    msg: 'GIRL_TC_REQUIRED'
  },
  GIRL_SC_REQUIRED: {
    type: 'GIRL_SC_REQUIRED',
    msg: 'GIRL_SC_REQUIRED'
  },
  GIRL_EN_REQUIRED: {
    type: 'GIRL_EN_REQUIRED',
    msg: 'GIRL_EN_REQUIRED'
  },

  INHERIT_TC_REQUIRED: {
    type: 'INHERIT_TC_REQUIRED',
    msg: 'INHERIT_TC_REQUIRED'
  },
  INHERIT_SC_REQUIRED: {
    type: 'INHERIT_SC_REQUIRED',
    msg: 'INHERIT_SC_REQUIRED'
  },
  INHERIT_EN_REQUIRED: {
    type: 'INHERIT_EN_REQUIRED',
    msg: 'INHERIT_EN_REQUIRED'
  },

  // db check
  GLOBAL_CONSTANTS_PAGE_NOT_EXISTS: {
    type: 'GLOBAL_CONSTANTS_PAGE_NOT_EXISTS',
    msg: 'GLOBAL_CONSTANTS_PAGE_NOT_EXISTS'
  },

  // general
  SERVER_ERROR: generalResponseTypes.SERVER_ERROR,
  CLIENT_ERROR: generalResponseTypes.CLIENT_ERROR
};

GlobalConstants.getGlobalConstantsForDisplay = globalConstants => {
  return {
    ...globalConstants,
    lastModifyDTDisplay: formatDateTimeString(globalConstants.lastModifyDT),
    lastModifyUserDisplay: globalConstants.lastModifyUser
      ? globalConstants.lastModifyUser.name
      : ''
  };
};

/* end of statics */

export default GlobalConstants;
