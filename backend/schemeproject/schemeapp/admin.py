from django.utils import timezone
from django.contrib import admin

from schemeapp.models import EligibilityQuestion, Scheme

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
    
@admin.register(Scheme)
class SchemeAdmin(admin.ModelAdmin):
    inlines = [EligibilityQuestionInline]
    list_display = ("title", "department", "gender", "min_age", "max_age",
                    "income_limit", "start_date", "end_date")
    search_fields = ("title", "department", "description", "required_education", "eligible_castes")
    list_filter = ("department", "gender", "employment_status", "disability_required", ActiveNowFilter, "start_date")
    date_hierarchy = "start_date"
    ordering = ("-start_date",)
    list_per_page = 25

