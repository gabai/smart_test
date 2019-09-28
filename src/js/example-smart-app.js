(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart)  {
      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
        var obv = smart.patient.api.fetchAll({
                    type: 'Observation',
                    query: {
                      code: {
                        $or: ['http://loinc.org|8302-2', 'http://loinc.org|8462-4',
                              'http://loinc.org|8480-6', 'http://loinc.org|2085-9',
                              'http://loinc.org|2089-1', 'http://loinc.org|55284-4',
							  'http://loinc.org|4548-4', 'http://loinc.org|6298-4',
							  'http://loinc.org|2069-3', 'http://loinc.org|49765-1',
							  'http://loinc.org|2339-0', 'http://loinc.org|2947-0',
							  'http://loinc.org|38483-4']
                      }
                    }
                  });
				  
/* 	4548-4 Hemoglobin
	6298-4 Potassium
	2069-3 Chloride
	49765-1 Calcium
	2339-0 Glucose
	2947-0 Sodium
	38483-4 Creatinine
	
*/


        $.when(pt, obv).fail(onError);

        $.when(pt, obv).done(function(patient, obv) {
          var byCodes = smart.byCodes(obv, 'code');
          var gender = patient.gender;

          var fname = '';
          var lname = '';

          if (typeof patient.name[0] !== 'undefined') {
            fname = patient.name[0].given.join(' ');
            lname = patient.name[0].family.join(' ');
          }

          var height = byCodes('8302-2');
          var systolicbp = getBloodPressureValue(byCodes('55284-4'),'8480-6');
          var diastolicbp = getBloodPressureValue(byCodes('55284-4'),'8462-4');
          var hdl = byCodes('2085-9');
          var ldl = byCodes('2089-1');
		  var hemoglobin = byCodes('4548-4');
		  var potassium = byCodes('6298-4');
		  var chloride = byCodes('2069-3');
		  var calcium = byCodes('49765-1');
		  var glucose = byCodes('2339-0');
		  var sodium = byCodes('2947-0');
		  var creatinine = byCodes('38483-4');
		  
          var p = defaultPatient();
          p.birthdate = patient.birthDate;
          p.gender = gender;
          p.fname = fname;
          p.lname = lname;
          p.height = getQuantityValueAndUnit(height[0]);

          if (typeof systolicbp != 'undefined')  {
            p.systolicbp = systolicbp;
          }

          if (typeof diastolicbp != 'undefined') {
            p.diastolicbp = diastolicbp;
          }

          p.hdl = getQuantityValueAndUnit(hdl[0]);
          p.ldl = getQuantityValueAndUnit(ldl[0]);
		  p.hemoglobin = getQuantityValueAndUnit(hemoglobin[0]);
		  p.potassium = getQuantityValueAndUnit(potassium[0]);
		  p.chloride = getQuantityValueAndUnit(chloride[0]);
		  p.calcium = getQuantityValueAndUnit(calcium[0]);
		  p.glucose = getQuantityValueAndUnit(glucose[0]);
		  p.sodium = getQuantityValueAndUnit(sodium[0]);
		  p.creatinine = getQuantityValueAndUnit(creatinine[0]);

          ret.resolve(p);
        });
      } else {
        onError();
      }
    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();

  };

  function defaultPatient(){
    return {
      fname: {value: ''},
      lname: {value: ''},
      gender: {value: ''},
      birthdate: {value: ''},
      height: {value: ''},
      systolicbp: {value: ''},
      diastolicbp: {value: ''},
      ldl: {value: ''},
      hdl: {value: ''},
	  hemoglobin: {value: ''},
      potassium: {value: ''},
	  chloride: {value: ''},
	  calcium: {value: ''},
	  glucose: {value: ''},
	  sodium: {value: ''},
	  creatinine: {value: ''},
    };
  }

  function getBloodPressureValue(BPObservations, typeOfPressure) {
    var formattedBPObservations = [];
    BPObservations.forEach(function(observation){
      var BP = observation.component.find(function(component){
        return component.code.coding.find(function(coding) {
          return coding.code == typeOfPressure;
        });
      });
      if (BP) {
        observation.valueQuantity = BP.valueQuantity;
        formattedBPObservations.push(observation);
      }
    });

    return getQuantityValueAndUnit(formattedBPObservations[0]);
  }

  function getQuantityValueAndUnit(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.valueQuantity != 'undefined' &&
        typeof ob.valueQuantity.value != 'undefined' &&
        typeof ob.valueQuantity.unit != 'undefined') {
          return ob.valueQuantity.value + ' ' + ob.valueQuantity.unit;
    } else {
      return undefined;
    }
  }

  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#fname').html(p.fname);
    $('#lname').html(p.lname);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
    $('#height').html(p.height);
    $('#systolicbp').html(p.systolicbp);
    $('#diastolicbp').html(p.diastolicbp);
    $('#ldl').html(p.ldl);
    $('#hdl').html(p.hdl);
	$('#hemoglobin').html(p.hemoglobin);
	$('#potassium').html(p.potassium);
	$('#chloride').html(p.chloride);
	$('#calcium').html(p.calcium);
	$('#glucose').html(p.glucose);
	$('#sodium').html(p.sodium);
	$('#creatinine').html(p.creatinine);
  };

})(window);
