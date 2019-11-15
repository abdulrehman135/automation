(function() {
    "use strict";

    angular
        .module("beckon.steel.cookbook.directives.cookbookTemplateBuilder", [
            "beckon.steel.grid.services.beckonGridFactory",
            "beckon.steel.cookbook.services.cookbookTemplateService",
            "beckon.steel.environment.services.environmentService",
        ])
        .directive("cookbookTemplateBuilder", function(
            environmentService,
            cookbookTemplateService,
            bnModalAlertService,
            windowService,
            modalDialogService,
            $resource,
            beckonGridFactory,
            gridEventService,
            gridCell,
            $templateCache,
            $state,
            svg
        ) {
            return {
                templateUrl: "cookbookTemplateBuilder",
                replace: true,
                scope: {},
                restrict: "E",
                controller: function($scope) {
                    $scope.baseUrl = environmentService.getRestInternalUrl(
                        "/cookbookTemplate/list"
                    );

                    $scope.gridConfig = _.extend(
                        beckonGridFactory.generateGridConfig(
                            $scope,
                            "cookbookBuilderGrid",
                            "cookbook templates"
                        ),
                        {
                            resource: $resource(
                                $scope.baseUrl,
                                {},
                                {
                                    query: {
                                        method: "GET",
                                        url: $scope.baseUrl,
                                        isArray: true,
                                    },
                                }
                            ),
                        }
                    );

                    function handleDelete(cookbook) {
                        cookbookTemplateService.delete(cookbook.id).$promise.then(function() {
                            bnModalAlertService.setAlert({
                                type: "success",
                                msgSafeHtml: cookbook.displayInfo.name + " has been deleted.",
                            });
                            $scope.$broadcast(gridEventService.refreshData);
                        });
                    }

                    $scope.addNewCookbook = function() {
                        const windowId = "addNewCookbook";
                        windowService.addWindow({
                            id: windowId,
                            title: "Add New Cookbook",
                            customTemplateUrl: "addNewCookbookTemplate",
                            scope: {
                                formConfig: {
                                    exampleCookbookJson:
                                        '[ "recipe human id1", { "humanId": "recipe human id2", "version": 3 } ]',
                                },
                                data: { id: null, displayInfo: null },
                                submit: function() {
                                    this.data.humanId = this.humanIdCore;
                                    const that = this;
                                    this.data.cookbookTemplateBlob = this.cookbookJson || "[]";
                                    cookbookTemplateService
                                        .create(this.data)
                                        .$promise.then(function() {
                                            bnModalAlertService.setAlert({
                                                type: "success",
                                                msgSafeHtml: `${
                                                    that.data.displayInfo.name
                                                } has been added successfully.`,
                                            });
                                            $scope.$broadcast(gridEventService.refreshData);
                                        })
                                        .catch(function(error) {
                                            bnModalAlertService.setAlert({
                                                type: "error",
                                                msgSafeHtml: `${
                                                    that.data.displayInfo.name
                                                } has an invalid JSON: ${error.data.message}.`,
                                            });
                                        });
                                    windowService.closeWindow(windowId);
                                },
                                cancel: function() {
                                    windowService.closeWindow(windowId);
                                },
                                change: function() {
                                    this.humanIdCore = this.data.displayInfo.name;
                                },
                            },
                            maxWidth: 400,
                            maxHeight: 740,
                        });
                    };

                    $scope.columnConfig = [
                        {
                            field: "displayInfo.name",
                            displayName: "Cookbook Name",
                            showFilterMenu: true,
                            width: "200px",
                        },
                        {
                            field: "displayInfo.explanation",
                            displayName: "Description",
                            showFilterMenu: true,
                            width: "200px",
                        },
                        {
                            field: "humanId",
                            displayName: "ID",
                            showFilterMenu: true,
                            width: "120px",
                        },
                        new gridCell.NumberCell("templateVersion", "Version"),
                        new gridCell.StringCell("status", "Status"),
                        {
                            field: "cookbookTemplateBlob",
                            displayName: "Cookbook Recipe Templates",
                            showFilterMenu: true,
                            width: "300px",
                            hidden: true,
                        },
                        {
                            field: "",
                            displayName: "",
                            width: "40px",
                            hideText: true,
                            actions: [
                                {
                                    action: function(cookbook) {
                                        const cookbookName = cookbook.displayInfo.name;
                                        modalDialogService.showDialog({
                                            bodyText: `Are you sure you want to delete the cookbook titled, "${cookbookName}"`,
                                            headerText: "Confirm Delete",
                                            positiveButton: {
                                                text: "Confirm",
                                                type: "danger",
                                                callback: function() {
                                                    handleDelete(cookbook);
                                                },
                                            },
                                            negativeButton: {
                                                text: "Cancel",
                                            },
                                        });
                                    },
                                    icon: svg.TRASH,
                                    qtipName: "Delete",
                                    show: function() {
                                        return true;
                                    },
                                },
                                {
                                    action: function(row) {
                                        $state.go("standard:cookbookTemplateDetails", {
                                            id: row.id,
                                        });
                                    },
                                    icon: svg.ARROW_RIGHT,
                                    qtipName: "Drilldown",
                                    show: function() {
                                        return true;
                                    },
                                },
                            ],
                            refreshAfterClick: true,
                            hoverTrue: false,
                            customTemplate: $templateCache.get("gridRowActions"),
                        },
                    ];
                },
            };
        });
})();
