from django.utils import timezone
from django.contrib import admin
from django.utils.html import format_html
from django.forms.models import BaseInlineFormSet
from django.core.exceptions import ValidationError
from schemeapp.models import Application, Districts, EligibilityQuestion,  RequiredDocuments, Scheme, States, SuccessfulApply, UploadedDocument

# Register your models here.
class ActiveNowFilter(admin.SimpleListFilter):
    title = 'Active status'
    parameter_name = 'active'

    def lookups(self, request, model_admin):
        return [('yser',"Active now"),("future","Starts later"),("past","Ended")]
    def queryset(self, request, queryset):
        today = timezone.now().date()
        if self.value() == 'yes':
            return queryset.filter(start_date__lte=today, end_date__gte=today)
        if self.value() =='future':
            return queryset.filter(start_date__gt=today)
        if self.value() == 'past':
            return queryset.filter(end_date__lt = today)
        return queryset

class EligibilityQuestionInline(admin.TabularInline):
    model = EligibilityQuestion
    extra = 1
    
class RequiredDocumentsInline(admin.TabularInline):
    model = RequiredDocuments
    extra = 1

@admin.register(Scheme)
class SchemeAdmin(admin.ModelAdmin):
    inlines = [EligibilityQuestionInline,RequiredDocumentsInline]
    list_display = ("title", "department", "gender", "min_age", "max_age",
                    "income_limit", "start_date", "end_date")
    search_fields = ("title", "department", "description", "required_education", "eligible_castes")
    list_filter = ("department", "gender", "occupation", "disability_required", ActiveNowFilter, "start_date")
    date_hierarchy = "start_date"
    ordering = ("-start_date",)
    list_per_page = 25







admin.site.register(States)
admin.site.register(Districts)

class DocumentReviewInline(admin.TabularInline):
    model = UploadedDocument
    extra = 0
    fields = ['document_name', 'file', 'is_approved', 'is_rejected', 'rejection_reason']
    readonly_fields = ['file', 'document_name']

    def document_name(self, instance):
        return instance.required_document.name

class RequiredSuccessPrintoutFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()

        if any(self.errors):
            return  # let normal errors raise first

        # Require at least one filled inline
        if not any(form.cleaned_data and not form.cleaned_data.get('DELETE', False) for form in self.forms):
            raise ValidationError("You must add at least one success printout.")

class SuccessPrintoutInline(admin.TabularInline):
    model = SuccessfulApply
    formset = RequiredSuccessPrintoutFormSet
    extra =1
@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'status', 'all_documents_approved')
    list_filter = ('status',)
    readonly_fields = ['user','scheme']
    
    def all_documents_approved(self, obj):
        documents = obj.uploaded_documents.all()
        return documents.exists() and all(doc.is_approved for doc in documents)


    all_documents_approved.boolean = True
    all_documents_approved.short_description = "Documents Approved"

    def get_inline_instances(self, request, obj=None):
        if obj is None:
            return []

        inlines = [DocumentReviewInline(self.model, self.admin_site)]

    # Show SuccessPrintoutInline only if all documents are approved
        if obj.uploaded_documents.exists() and all(doc.is_approved for doc in obj.uploaded_documents.all()):
            inlines.append(SuccessPrintoutInline(self.model, self.admin_site))

        return inlines




