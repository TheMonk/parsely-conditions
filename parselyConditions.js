(function($) {
    $.parselyConditions = function(options) {
        var parselyC = {
            options: $.extend({
                'validationfields': '',
                'formname': '#parsely-form',
                'csstoggle': 'parselyTaDa'
            }, options),

            /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
            conditionalFields: function() {

                if ($.isArray(options.validationfields)) {
                    
                    $.each(options.validationfields, function() {

                        var tempSelector, currentValue, tempType = this.ftype,
                            fvalueMatch = false;
                        var root = this;

                        var matchResults = parselyC.matchValues(tempType, this.fid, this.fvalue, fvalueMatch);

                        fvalueMatch = matchResults.fMatched;
                        currentValue = matchResults.curVal;

                        if (this.faffected != false) {
                            if (fvalueMatch == true) {

                                if ($.isArray(this.faffected)) {
                                    $.each(this.faffected, function() {
                                        parselyC.addField(this);
                                    });
                                } else {
                                    parselyC.addField(this.faffected);
                                }

                            } else if (currentValue != this.fvalue) {
                                if ($.isArray(this.faffected)) {
                                    $.each(this.faffected, function() {
                                        parselyC.removeField(this);
                                    });
                                } else {
                                    parselyC.removeField(this.faffected);
                                }
                            }
                        }
                    });

                }


                if ($('#' + parselyC.options.formname).parsley('validate')) {
                    return true;
                } else {
                    return false;
                }
            },


            /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
            conditionalShow: function() {

                parselyC.options.functiontoggle;

                if ($.isArray(options.validationfields)) {
                    $.each(options.validationfields, function() {

                        var matchResults, fvalueMatch = false;
                        var root = this; 

                        if (this.fhide !== false && this.fhide !== undefined) { 

                            var tempSelector;
                            if (this.ftype == 'checklist' || this.ftype == 'radio') {
                                tempSelector = tempSelector = '[name="' + this.fid + '"]';
                            } else {
                                tempSelector = '#' + this.fid
                            }

                            $(tempSelector).change(function() {

                                
                                matchResults = parselyC.matchValues(root.ftype, root.fid, root.fvalue, fvalueMatch);
                                
                                if (matchResults.fMatched) {
                                    
                                    parselyC.toggleClass(root.fhide,'add');
                                } else {
                                    parselyC.toggleClass(root.fhide,'remove');

                                }
                            });
                        }
                    });
                }
            },

        /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX 
          Begin Utility Functions
       XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

            matchValues: function(fieldType, fieldId, fieldValue, fieldMatched) {
                var tempSelector, currentValue;
                root = this;

                
                if (fieldType == 'checkbox') {
                    tempSelector = '[name="' + fieldId + '"]:checked';
                    currentValue = $(tempSelector).val();

                } else if (fieldType == 'select') {
                    tempSelector = '#' + fieldId;
                    currentValue = $(tempSelector).val();

                } else if (fieldType == 'checklist' || fieldType == 'radio') {

                    tempSelector = '[name="' + fieldId + '"]:checked';
                    $(tempSelector).each(function() {
                        if (this.checked) {
                            if ($(this).val() == fieldValue) {
                                currentValue = $(this).val();
                            }
                        }
                    });
                }

                
                if ($.isArray(fieldValue)) {
                    $.each(fieldValue, function(iter, iterVal) {
                        if (currentValue == iterVal || fieldMatched == true) {
                            fieldMatched = true;
                        }
                    });
                } else {
                    if (currentValue == fieldValue || fieldMatched == true) {
                        fieldMatched = true;
                    }
                }

                return {
                    'curVal': currentValue, 
                    'fMatched': fieldMatched 
                };

            },

            addField: function(fieldName) {
                var affectedField = '#' + fieldName;
                var tempFieldType = $(affectedField).attr('type'); 
                if (tempFieldType != 'checkbox') {
                    $('#' + parselyC.options.formname).parsley('removeItem', affectedField); 
                }
                $('#' + parselyC.options.formname).parsley('addItem', affectedField);
            },

            removeField: function(fieldName) {
                var affectedField = '#' + fieldName;
                $('#' + parselyC.options.formname).parsley('removeItem', affectedField);
            },

            toggleClass: function(toggleIds, addRemove) {
                if ($.isArray(toggleIds)) {
                    $.each(toggleIds, function() {
                        if (addRemove == 'add') {
                            $('#' + this).addClass(parselyC.options.csstoggle);
                        } else {
                            $('#' + this).removeClass(parselyC.options.csstoggle);
                        }
                    });
                } else {
                    if (addRemove == 'add') {
                        $('#' + toggleIds).addClass(parselyC.options.csstoggle);
                    } else {
                        $('#' + toggleIds).removeClass(parselyC.options.csstoggle);
                    }
                    
                }
            }


        };

        return {
            checkFields: parselyC.conditionalFields,
            toggleFields: parselyC.conditionalShow
        };
    };
})(jQuery);