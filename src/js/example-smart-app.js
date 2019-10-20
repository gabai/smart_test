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
                        $or: ['http://loinc.org|8302-2', 'http://loinc.org|3141-9', //height and weight
						
						'http://loinc.org|8462-4', 'http://loinc.org|8480-6', 'http://loinc.org|55284-4',
						'http://loinc.org|9279-1', 'http://loinc.org|8310-5', 'http://loinc.org| 8867-4',
						'http://loinc.org|2710-2', //vitals
						
						'http://loinc.org|2085-9', 'http://loinc.org|2089-1', //cholesterol, ldl
						
						'http://loinc.org|2823-3', 'http://loinc.org|2075-0', 'http://loinc.org|17861-6',
						'http://loinc.org|2345-7', 'http://loinc.org|2951-2', 'http://loinc.org|26464-8',
						'http://loinc.org|2160-0', 'http://loinc.org|718-7', 'http://loinc.org|26515-7',
						'http://loinc.org|3094-0', 'http://loinc.org|2028-9', 'http://loinc.org|2951-2',
						'http://loinc.org|38483-4', //rounding labs
						
						'http://loinc.org|4548-4'] //other labs (a1c)
                      }
                    }
                  });


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

/*			
			String test_names = ['height', 'weight'];
			String test_codes = ['8302-2', '3141-9'];

			for (String i=0; i<test_names.lenght; i++){
				for (int j=0; a<test_codes.lenght; j++){
				var [i] = [j];
				}
			}
			[test_names, test_code].forEach(
			function (a) {
				[0, 1].forEach(
				  function (i) {
					var [a] = [i];
				  }
				);
			  }
			);
*/			

			var height = byCodes('8302-2');
			var weight = byCodes('3141-9');

			var hr = byCodes('8867-4');
			var rr = byCodes('9279-1');
			var temp = byCodes('8310-5');
			var o2 = byCodes('2710-2');
			var sys = getBloodPressureValue(byCodes('55284-4'),'8480-6');
			var dia = getBloodPressureValue(byCodes('55284-4'),'8462-4');
		
			var wbc = byCodes('26464-8');
			var hgb = byCodes('718-7');
			var plt = byCodes('26515-7');
		
			var k = byCodes('2823-3');
			var cl = byCodes('2075-0');
			var ca = byCodes('17861-6');
			var glu = byCodes('2345-7');
			var na = byCodes('2951-2');
			var cr = byCodes(('38483-4'),'2160-0');
			var bun = byCodes('3094-0');
			var co2 = byCodes('2028-9');
	
			var hdl = byCodes('2085-9');
			var ldl = byCodes('2089-1');
			var hemoglobin = byCodes('4548-4');
			var potassium = byCodes('6298-4');
			var chloride = byCodes('2069-3');
			var calcium = byCodes('49765-1');
			var glucose = byCodes('2339-0');
			var sodium = byCodes('2947-0');
			var creatinine = byCodes('38483-4');

			var a1c = byCodes('4548-4');
	  
			var p = defaultPatient();
			
			p.birthdate = patient.birthDate;
			p.gender = gender;
			p.fname = fname;
			p.lname = lname;
		
			p.height = getQuantityValueAndUnit(height[0]);
			p.weight = getQuantityValueAndUnit(weight[0]);
		
			p.hr = getQuantityValueAndUnit(hr[0]);
			p.rr = getQuantityValueAndUnit(rr[0]);
			p.temp = getQuantityValueAndUnit(temp[0]);
			p.o2 = getQuantityValueAndUnit(o2[0]);

			if (typeof sys != 'undefined')  {
				p.sys = sys;
			}

			if (typeof dia != 'undefined') {
				p.dia = dia;
			}

			p.wbc = getQuantityValueAndUnit(wbc[0]);
			p.plt = getQuantityValueAndUnit(plt[0]);
			p.hgb = getQuantityValueAndUnit(hgb[0]);
		
			p.k = getQuantityValueAndUnit(k[0]);
			p.cl = getQuantityValueAndUnit(cl[0]);
			p.ca = getQuantityValueAndUnit(ca[0]);
			p.glu = getQuantityValueAndUnit(glu[0]);
			p.na = getQuantityValueAndUnit(na[0]);
			p.cr = getQuantityValueAndUnit(cr[0]);
			p.bun = getQuantityValueAndUnit(bun[0]);
			p.co2 = getQuantityValueAndUnit(co2[0]);
		
			p.hdl = getQuantityValueAndUnit(hdl[0]);
			p.ldl = getQuantityValueAndUnit(ldl[0]);
			p.a1c = getQuantityValueAndUnit(a1c[0]);
			
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
      weight: {value: ''},
	    
      hr: {value: ''},
      rr: {value: ''},
      temp: {value: ''},
      o2: {value: ''},
      sys: {value: ''},
      dia: {value: ''},
	    
      wbc: {value: ''},
      hgb: {value: ''},
      plt: {value: ''},
	    
      k: {value: ''},
      cl: {value: ''},
      ca: {value: ''},
      glu: {value: ''},
      na: {value: ''},
      cr: {value: ''},
      co2: {value: ''},
      bun: {value: ''},
	    
      ldl: {value: ''},
      hdl: {value: ''},
      a1c: {value: ''},
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
    $('#weight').html(p.weight);
	
    $('#hr').html(p.hr);
    $('#rr').html(p.rr);
    $('#temp').html(p.temp);
    $('#o2').html(p.o2);
    $('#sys').html(p.sys);
    $('#dia').html(p.dia);
    
    $('#wbc').html(p.wbc);
    $('#hgb').html(p.hgb);
    $('#plt').html(p.plt);
	  
    $('#k').html(p.k);
    $('#cl').html(p.cl);
    $('#ca').html(p.ca);
    $('#glu').html(p.glu);
    $('#na').html(p.na);
    $('#cr').html(p.cr);
    $('#bun').html(p.bun);
    $('#co2').html(p.co2);
  
    $('#ldl').html(p.ldl);
    $('#hdl').html(p.hdl);

    $('#a1c').html(p.a1c);  
  };

})(window);
