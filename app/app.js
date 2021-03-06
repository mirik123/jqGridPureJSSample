/*jslint continue: true, nomen: true, plusplus: true, unparam: true, todo: true, vars: true, white: true */
/*global jQuery */

$(document).ready(function () {
    function selectFormatter(cellvalue, options, rowObject) {
        if (!cellvalue && cellvalue !== 0) {
            return '<span class="cellWithoutBackground" data-id="-1" style="background-color:transparent"></span>';
        }

        if ($('#' + options.gid).getGridParam('datatype') === 'xml') {
            var xmlvalue = $(options.colModel.name, rowObject);
            cellvalue = $.jgrid.odataHelper.convertXmlToJson(xmlvalue[0]);
        }

        if (!$.isPlainObject(cellvalue)) {
            //var selRowId = $("#grid").jqGrid('getGridParam', 'selrow');
            var cell = $('tr#' + options.rowId + ' select[name=' + options.colModel.name + ']', '#grid');

            if (!rowObject.id) {
                cell = cell.find('option[value=' + cellvalue + ']');
            }
            else {
                cell = cell.find('option:selected');
            }

            cellvalue = { Id: cell.val(), color: cell.data('bkcolor'), descr: cell.text() };
        }

        return '<span class="cellWithoutBackground" data-id="' + cellvalue.Id + '" style="background-color:' + cellvalue.color + '">' + cellvalue.descr + '</span>';
    }

   /* var colModelDefinition = [
        {
            label: 'Client Id', name: 'id', index: 'id', editable: false, searchrules: { integer: true },
            formatter: function (cellvalue, options, rowObject) { return '<a href="#" target="_self" data-id="' + cellvalue + '">' + cellvalue + '</a>'; },
            unformat: function (cellvalue, options, cell) { return $('a', cell).data('id'); }
        },
        {
            label: 'Client Type', name: 'cltype', index: 'cltype', editable: true, //xmlmap: 'cltype > Id',
            formatter: selectFormatter,
            unformat: function (cellvalue, options, cell) { return $('span', cell).data('id'); },
            editoptions: { dataUrl: '/api/ApiServices/GetSelectData?table=ClientType' },
            searchoptions: { dataUrl: '/api/ApiServices/GetSelectData?table=ClientType&empty=true' },
            searchrules: { integer: true }, edittype: 'select', stype: 'select',
            odataunformat: function (searchField, searchString, searchOper) { return searchString !== '-1' ? 'cltype/Id' : null; }
        },
        {
            label: 'Client Status', name: 'status', index: 'status', editable: true, //xmlmap: 'status > Id',
            formatter: selectFormatter,
            unformat: function (cellvalue, options, cell) { return $('span', cell).data('id'); },
            editoptions: { dataUrl: '/api/ApiServices/GetSelectData?table=ClientStatus' },
            searchoptions: { dataUrl: '/api/ApiServices/GetSelectData?table=ClientStatus&empty=true' },
            searchrules: { integer: true }, edittype: 'select', stype: 'select',
            odataunformat: function (searchField, searchString, searchOper) { return searchString !== '-1' ? 'status/Id' : null; }
        }
    ];*/

    //3,xml,xml,http://services.odata.org/V3/(S(o3gw2dlhw31znr3sglld2njz))/OData/OData.svc/Products
    var odatainit = {
        annotations: false,
        metadatatype: 'xml',
        datatype: 'json',
        version: 4,
        gencolumns: true,
        entitySet: 'Products',
        expandable: 'subgrid',
        odataurl: "http://services.odata.org/V4/OData/OData.svc/Products",
        metadataurl: 'http://services.odata.org/V4/OData/OData.svc/$metadata',
        errorfunc: function (jqXHR, parsedError) {
            jqXHR = jqXHR.xhr || jqXHR;
            jqXHR = jqXHR.xhr || jqXHR;
            parsedError = $('#errdialog').html() + parsedError;
            $('#errdialog').html(parsedError).dialog('open');
        },
        odataverbs: {
            inlineEditingAdd: 'PUT',
            inlineEditingEdit: 'PATCH',
            formEditingAdd: 'PUT',
            formEditingEdit: 'POST'
        }
    };

    function initODataTable() {
        $("#grid").jqGrid({
            height: '100%',
            width: '100%',
            pager: $('#gridpager'),
            sortname: 'ID',
            viewrecords: true,
            sortorder: "asc",
            deepempty: true,
            altRows: true,
            footerrow: false,
            shrinkToFit: true,
            ignoreCase: true,
            gridview: true,
            headertitles: true,
            sortable: true,
            autowidth: true,
            toppager: true,
            rowNum: 5,
            toolbar: [true, 'top'],
            url: '',
            ondblClickRow: function (id) {
                $(this).jqGrid('editRow', id, {
                    beforeEditRow: function (options, rowid) {
                        return true;
                    }
                });
                $("#grid_ilsave").removeClass('ui-state-disabled');
            },
            multiSort: true,
            iconSet: "jQueryUI",
            loadError: function (jqXHR, textStatus, errorThrown) {
                var parsedError = $.jgrid.odataHelper.loadError(jqXHR, textStatus, errorThrown);
                parsedError = $('#errdialog').html() + parsedError;
                $('#errdialog').html(parsedError).dialog('open');
            },
            beforeInitGrid: function () {
                $(this).jqGrid('odataInit', odatainit);
            }
        })
        .jqGrid("navGrid", "#pg_grid_toppager", { add: true, del: true, edit: true, view: true, reload: true, search: false, cloneToTop: true },
        {
            closeAfterEdit: true
        },
        {
            closeAfterAdd: true
        })
        .jqGrid('inlineNav', "#pg_grid_toppager", {
            add: true, edit: false, save: true, cancel: false,
            editParams: {
                keys: true
            }
        })
        .jqGrid('filterToolbar', { searchOnEnter: false, enableClear: false, stringResult: true })
        .jqGrid('searchGrid', { multipleSearch: true, multipleGroup: false, overlay: 0 });

        $('#searchmodfbox_grid').css('position', 'initial');
        $('#searchmodfbox_grid').appendTo('#new_fbox_grid');
        $('#t_grid, .ui-jqgrid-titlebar, #searchmodfbox_grid .ui-jqdialog-titlebar-close').hide();
    }

    $('#errdialog').dialog({
        autoOpen: false,
        modal: true,
        width: 'auto',
        buttons: {
            Ok: function() {
                $( this ).dialog( "close" );
            }
        }
    });

    initODataTable();
});
