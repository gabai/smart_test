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
                        $or: ['http://loinc.org|8302-2', 'http://loinc.org|29463-7', //height and weight
						
						'http://loinc.org|8462-4', 'http://loinc.org|8480-6', 'http://loinc.org|55284-4',
						'http://loinc.org|9279-1', 'http://loinc.org|8310-5', 'http://loinc.org| 8867-4',
						'http://loinc.org|2710-2', //vitals
						
						'http://loinc.org|2085-9', 'http://loinc.org|2089-1', //cholesterol, ldl
						
						'http://loinc.org|6298-4', 'http://loinc.org|2075-0', 'http://loinc.org|17861-6',
						'http://loinc.org|2345-7', 'http://loinc.org|2951-2', 'http://loinc.org|6690-2',
						'http://loinc.org|2160-0', 'http://loinc.org|718-7', 'http://loinc.org|26515-7',
						'http://loinc.org|3094-0', 'http://loinc.org|2028-9', 'http://loinc.org|2951-2', //rounding labs
						
						'http://loinc.org|4548-4'] //other labs (a1c)
                      }
                    }
                  });
		  
/* 	
Vitals
* 8302-2 Height
* 29463-7 Weight
	3141-9 weight
* 9279-1 respiratory_rate
* 8310-5 temperature
	8480-6 Systolic blood pressure
	8462-4 Diastolic blood pressure
* 8867-4 heart_rate
* 2710-2 oxygen_saturation

Rounding labs (* in use)
  26464-8 WBC # Bld
	*6690-2 WBC
* 718-7 Hgb bld-mcnc (confirmed)
* 26515-7 Platelet # Bld
* 6298-4 Potassium
	2823-3 Potassium SerPl-sCnc
  2069-3 Chloride
	*2075-0 Chloride SerPl-sCnc (Confirmed)
  49765-1 Calcium 
	*17861-6 Calcium SerPl-mCnc (confirmed)
  2339-0 Glucose
	*2345-7 Glucose SerPl-mCnc (confirmed)
  2947-0 Sodium
	*2951-2 Sodium SerPl-sCnc (confirmed)
  38483-4 Creatinine
	*2160-0 Creat SerPl-mCnc (confirmed)
* 3094-0 BUN SerPl-mCnc (confirmed)
* 2028-9 CO2 SerPl-sCnc

Other Labs
* 4548-4 Hemoglobin a1c
	1742-6 ALT SerPl-cCnc (confirmed)
	789-8 RBC # Bld Auto
	11580-8 TSH SerPl DL<=0.005 mU/L-aCnc
	10466-1 Anion Gap3 SerPl-sCnc (confirmed)
	
Testing
1742-6	ALT
1920-8	AST
1751-7	Albumin Level
6768-6	Alkaline Phosphatase
6697-7	Amylase Level
10466-1	Anion Gap
1968-7	Bilirubin Direct
1971-1	Bilirubin Indirect
2093-3	Cholesterol
2085-9	Cholesterol HDL
13457-7	Cholesterol LDL (Calculated)
18262-6	Cholesterol LDL (Direct)
9830-1	Cholesterol/ HDL Ratio
2160-0	Creatinine
2276-4	Ferritin
2284-8	Folate Level
48642-3	GFR
48643-1	GFR AfrAmer
2324-2	GGT
1504-0	Glucose 1H Post 50 G
1521-4	Glucose 2H PP
1521-4	Glucose 2H PP
32016-8	Glucose Bld Glucometer
2345-7	Glucose Fasting
2345-7	Glucose Level
2339-0	Glucose WB
4544-3	Hct
31100-1	Hematocrit Venous Bld, Calculated
4548-4	Hemoglobin A1c
34660-1	Hemoglobin A2
785-6	MCH
786-4	MCHC
787-2	MCV
738-5	Macrocytes
2601-3	Magnesium Level
741-9	Microcytes
742-7	Mono Abs
749-2	Myelocyte
751-8	Neut Abs
21418-9	Neutrophil Ab
770-8	Neutrophils
43396-1	Non-HDL Cholesterol (Calculated)
2692-2	Osmolality
2695-5	Osmolality Ur
2777-1	Phosphate
777-3	Platelet
2823-3	Potassium Level
2885-2	Protein
789-8	RBC
18309-5	RBC Nuc
788-0	RDW
17849-1	Reticulocyte Count
768-2	Segs


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
			var weight = byCodes('29463-7');
		
			var hr = byCodes('8867-4');
			var rr = byCodes('9279-1');
			var temp = byCodes('8310-5');
			var o2 = byCodes('2710-2');
			var sys = getBloodPressureValue(byCodes('55284-4'),'8480-6');
			var dia = getBloodPressureValue(byCodes('55284-4'),'8462-4');
		
			var wbc = byCodes('6690-2');
			var hgb = byCodes('718-7');
			var plt = byCodes('26515-7');
		
			var k = byCodes(['6298-4','2823-3']);
			var cl = byCodes(['2075-0']);
			var ca = byCodes('17861-6');
			var glu = byCodes('2345-7');
			var na = byCodes('2951-2');
			var cr = byCodes('2160-0');
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
