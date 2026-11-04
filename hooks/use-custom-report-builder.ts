'use client'

import { toast } from "@/components/ui";
import { useDeleteReportTemplateApi, useSaveReportTemplateApi, validateBuilderConfig } from "lib";
import { useEffect, useState } from "react";
import type {
    ReportBuilderConfig, ReportBuilderResult, ReportDataset, ReportExportFormat, ReportFormErrors, ReportRole, ReportTemplate,
} from "types";
import { REPORT_DEFAULT_BUILDER_CONFIG, runCustomReport } from "utils";
import { useReportExport } from "./use-report-export";
import { useReportCatalogQuery, useReportDatasetQuery, useReportTemplatesQuery } from "./use-reports-queries";

export interface UseCustomReportBuilderReturn {
    config: ReportBuilderConfig;
    update: <K extends keyof ReportBuilderConfig>(key: K, value: ReportBuilderConfig[K]) => void;
    sources: { id: string; title: string }[];
    dataset: ReportDataset | null;
    isLoadingDataset: boolean;
    errors: ReportFormErrors;
    result: ReportBuilderResult | null;
    chooseSource: (datasetId: string) => void;
    toggleField: (key: string) => void;
    moveField: (key: string, dir: -1 | 1) => void;
    reset: () => void;
    templates: ReportTemplate[];
    loadTemplate: (template: ReportTemplate) => void;
    deleteTemplate: (id: string) => void;
    saveOpen: boolean;
    setSaveOpen: (open: boolean) => void;
    saveTemplate: (name: string) => void;
    isSaving: boolean;
    exportPreview: (format: ReportExportFormat) => void;
}

export function useCustomReportBuilder(role: ReportRole): UseCustomReportBuilderReturn {
    const [config, setConfig] = useState<ReportBuilderConfig>(REPORT_DEFAULT_BUILDER_CONFIG)
    const [saveOpen, setSaveOpen] = useState(false)
    const [pickDefaultFields, setPickDefaultFields] = useState(false)

    const catalogQ = useReportCatalogQuery()
    const templatesQ = useReportTemplatesQuery()
    const datasetQ = useReportDatasetQuery(config.datasetId || null)
    const { exportReport } = useReportExport()

    const { mutate: saveTemplateApi, isPending: isSaving } = useSaveReportTemplateApi({
        onSuccess: () => {
            setSaveOpen(false)
            toast.success("Template saved")
        },
        onError: () => toast.error("Could not save the template.")
    })

    const { mutate: deleteTemplateApi } = useDeleteReportTemplateApi({
        onSuccess: () => toast.success("Template deleted")
    })

    const sources = (catalogQ.data ?? []).filter((source) => source.roles.includes(role))
    const dataset = datasetQ.data ?? null
    const errors: ReportFormErrors = dataset ? validateBuilderConfig(config, dataset.columns) : {}
    const result = dataset && Object.keys(errors).length === 0 ? runCustomReport(dataset, config) : null

    // after a new source is chosen and its data arrives, pre-pick the first two columns so the preview shows something
    useEffect(() => {
        if (pickDefaultFields && dataset && dataset.id === config.datasetId) {
            const firstTwo = dataset.columns.slice(0, 2).map((column) => column.key)
            setConfig((prev) => ({ ...prev, fields: firstTwo }))
            setPickDefaultFields(false)
        }
    }, [pickDefaultFields, dataset, config.datasetId])

    const update = <K extends keyof ReportBuilderConfig>(key: K, value: ReportBuilderConfig[K]) => {
        setConfig((prev) => ({ ...prev, [key]: value }))
    }

    const chooseSource = (datasetId: string) => {
        setConfig({ ...REPORT_DEFAULT_BUILDER_CONFIG, datasetId })
        setPickDefaultFields(true)
    }

    const toggleField = (key: string) => {
        if (config.fields.includes(key)) {
            update("fields", config.fields.filter((field) => field !== key))
        } else {
            update("fields", [...config.fields, key])
        }
    }

    const moveField = (key: string, dir: -1 | 1) => {
        const from = config.fields.indexOf(key)
        const to = from + dir
        if (from < 0 || to < 0 || to >= config.fields.length) return

        const next = [...config.fields]
        next[from] = config.fields[to]
        next[to] = config.fields[from]
        update("fields", next)
    }

    const reset = () => {
        setConfig(REPORT_DEFAULT_BUILDER_CONFIG)
        setPickDefaultFields(false)
    }

    const loadTemplate = (template: ReportTemplate) => {
        setConfig(template.config)
        toast.success(`Loaded "${template.name}"`)
    }

    const deleteTemplate = (id: string) => {
        deleteTemplateApi(id)
    }

    const saveTemplate = (name: string) => {
        saveTemplateApi({ name, config })
    }

    const exportPreview = (format: ReportExportFormat) => {
        if (!dataset || !result) return

        const custom: ReportDataset = {
            ...dataset,
            id: "custom",
            title: `Custom report: ${dataset.title}`,
            columns: result.columns,
            rows: result.rows,
            chart: result.chart
        }
        exportReport(format, custom.title, [custom])
    }

    return {
        config,
        update,
        sources,
        dataset,
        isLoadingDataset: datasetQ.isLoading,
        errors,
        result,
        chooseSource,
        toggleField,
        moveField,
        reset,
        templates: templatesQ.data ?? [],
        loadTemplate,
        deleteTemplate,
        saveOpen,
        setSaveOpen,
        saveTemplate,
        isSaving,
        exportPreview
    }
}
